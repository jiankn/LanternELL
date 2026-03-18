/**
 * PDF 页面溢出处理
 * 
 * 在 Puppeteer 打印 PDF 前注入到页面中执行。
 * 遍历所有 .pdf-page，检测内容是否超出可用高度。
 * 如果超出，把溢出的子元素移到新的 .pdf-page（带完整页眉/页脚/背景）。
 * 
 * 核心策略：
 * 1. 找到包含多个"原子单元"（卡片/item）的最深容器
 * 2. 在原子单元之间拆分，绝不在卡片中间截断
 * 3. 拆分后的续页带完整页眉/页脚/背景
 */

export const OVERFLOW_HANDLER_FN = function () {
  const LETTER_HEIGHT = 11 * 96; // 1056px
  const SAFETY_MARGIN = 12;

  // 这些 class 代表"原子单元"——不可再拆分的卡片/块
  const ATOM_CLASSES = [
    'vocab-card', 'vocab-cell', 'vocab-row',
    'frame-card', 'dialogue-card', 'prompt-card',
    'label-card-new', 'routine-card-new', 'rule-card',
    'pn-card', 'minibook-card',
    'ws-item', 'ws-matching-item', 'ws-coloring-item', 'ws-tracing-item',
    'note-section', 'ak-section', 'terms-section', 'terms-compact',
    'cut-line-h',
  ];

  // 这些 class 代表"容器"——包含多个原子单元的列表/网格
  const CONTAINER_CLASSES = [
    'vocab-container', 'frames-list', 'dialogue-list',
    'prompt-grid', 'labels-grid-new', 'routine-grid-new',
    'rules-list', 'parent-notes-list', 'minibook-grid-new',
    'ws-items', 'ws-matching-grid', 'ws-coloring-grid',
    'notes-grid', 'answer-list', 'terms-grid',
  ];

  function isAtom(el) {
    return ATOM_CLASSES.some(cls => el.classList?.contains(cls));
  }
  function isContainer(el) {
    return CONTAINER_CLASSES.some(cls => el.classList?.contains(cls));
  }

  /**
   * 找到最佳拆分点：返回 { container, splitIndex }
   * container: 包含可拆分子元素的 DOM 节点
   * splitIndex: 从哪个子元素开始移到新页面
   */
  function findSplitPoint(content, availableHeight) {
    const contentRect = content.getBoundingClientRect();
    const contentStyle = window.getComputedStyle(content);
    const paddingTop = parseFloat(contentStyle.paddingTop) || 0;

    // 递归查找：优先在最深的容器级别拆分
    function findDeepestSplit(parent) {
      const children = Array.from(parent.children);
      if (children.length === 0) return null;

      // 先检查子元素中是否有容器，如果有，优先在容器内部拆分
      for (const child of children) {
        if (isContainer(child)) {
          const containerChildren = Array.from(child.children);
          if (containerChildren.length > 1) {
            // 在这个容器内找拆分点
            for (let i = 0; i < containerChildren.length; i++) {
              const rect = containerChildren[i].getBoundingClientRect();
              const bottom = rect.bottom - contentRect.top - paddingTop;
              if (bottom > availableHeight && i > 0) {
                return { container: child, splitIndex: i };
              }
            }
          }
        }
        // 如果子元素不是容器也不是原子，递归深入
        if (!isAtom(child) && !isContainer(child) && child.children?.length > 0) {
          const deeper = findDeepestSplit(child);
          if (deeper) return deeper;
        }
      }

      // 没有找到容器级别的拆分点，在当前层级拆分
      if (children.length > 1) {
        for (let i = 0; i < children.length; i++) {
          const rect = children[i].getBoundingClientRect();
          const bottom = rect.bottom - contentRect.top - paddingTop;
          if (bottom > availableHeight && i > 0) {
            return { container: parent, splitIndex: i };
          }
        }
      }

      return null;
    }

    return findDeepestSplit(content);
  }

  /**
   * 构建从 content 到 container 的 DOM 路径
   */
  function getPathFromContent(content, container) {
    const path = [];
    let node = container;
    while (node && node !== content) {
      path.unshift(node);
      node = node.parentNode;
    }
    return path;
  }

  /**
   * 创建新的 pdf-page，复制页面框架
   */
  function createNewPage(originalPage) {
    const newPage = document.createElement('section');
    newPage.className = originalPage.className;

    const brandBar = originalPage.querySelector('.brand-bar');
    if (brandBar) newPage.appendChild(brandBar.cloneNode(true));

    const watermark = originalPage.querySelector('.watermark');
    if (watermark) newPage.appendChild(watermark.cloneNode(true));

    const header = originalPage.querySelector('.page-header');
    if (header) {
      const newHeader = header.cloneNode(true);
      const titleSpan = newHeader.children[1];
      if (titleSpan && !titleSpan.textContent.includes('(cont.)')) {
        titleSpan.textContent = titleSpan.textContent + ' (cont.)';
      }
      newPage.appendChild(newHeader);
    }

    return newPage;
  }

  // === 主循环 ===
  const originalCount = document.querySelectorAll('.pdf-page').length;
  if (!originalCount) return { originalPages: 0, finalPages: 0, overflowPages: 0 };

  let overflowCount = 0;
  let maxIterations = 100;
  let hasOverflow = true;

  while (hasOverflow && maxIterations-- > 0) {
    hasOverflow = false;
    const pages = Array.from(document.querySelectorAll('.pdf-page'));

    for (const page of pages) {
      const content = page.querySelector('.page-content');
      if (!content) continue;

      const brandBar = page.querySelector('.brand-bar');
      const header = page.querySelector('.page-header');
      const footer = page.querySelector('.page-footer');
      const usedByChrome =
        (brandBar ? brandBar.offsetHeight : 0) +
        (header ? header.offsetHeight : 0) +
        (footer ? footer.offsetHeight : 0);

      const cs = window.getComputedStyle(content);
      const pt = parseFloat(cs.paddingTop) || 0;
      const pb = parseFloat(cs.paddingBottom) || 0;
      const availableHeight = LETTER_HEIGHT - usedByChrome - pt - pb - SAFETY_MARGIN;

      // 检查是否溢出
      const contentRect = content.getBoundingClientRect();
      const children = Array.from(content.children);
      if (!children.length) continue;
      const lastChild = children[children.length - 1];
      const lastBottom = lastChild.getBoundingClientRect().bottom - contentRect.top - pt;
      if (lastBottom <= availableHeight) continue;

      // 找拆分点
      const split = findSplitPoint(content, availableHeight);
      if (!split) continue; // 无法拆分（单个巨大元素）

      hasOverflow = true;
      overflowCount++;

      // 创建新页面
      const newPage = createNewPage(page);
      const newContent = document.createElement('main');
      newContent.className = 'page-content';

      const { container, splitIndex } = split;
      const containerChildren = Array.from(container.children);
      const overflowElements = containerChildren.slice(splitIndex);

      if (container === content) {
        // 直接在 page-content 层拆分
        for (const el of overflowElements) {
          newContent.appendChild(el);
        }
      } else {
        // 深层拆分：重建从 content 到 container 的包裹结构
        const pathNodes = getPathFromContent(content, container);

        let currentParent = newContent;
        for (const pathNode of pathNodes) {
          if (pathNode === container) {
            // container 本身：克隆空壳，把溢出元素放进去
            const clonedContainer = pathNode.cloneNode(false);
            for (const el of overflowElements) {
              clonedContainer.appendChild(el);
            }
            currentParent.appendChild(clonedContainer);
          } else {
            // 中间包裹层：克隆空壳
            const wrapper = pathNode.cloneNode(false);
            currentParent.appendChild(wrapper);
            currentParent = wrapper;
          }
        }
      }

      newPage.appendChild(newContent);

      // 复制 footer
      if (footer) newPage.appendChild(footer.cloneNode(true));

      // 插入新页面
      page.parentNode.insertBefore(newPage, page.nextSibling);
    }
  }

  // 更新所有页码
  const finalPages = document.querySelectorAll('.pdf-page');
  const total = finalPages.length;
  finalPages.forEach((page, i) => {
    const footer = page.querySelector('.page-footer');
    if (footer) {
      const spans = footer.querySelectorAll('span');
      if (spans.length >= 3) {
        spans[spans.length - 1].textContent = `Page ${i + 1} / ${total}`;
      }
    }
  });

  // 重新定位 sample-cta：倒数第二页
  const allCtas = document.querySelectorAll('.sample-cta');
  allCtas.forEach(cta => cta.remove());
  if (allCtas.length > 0 && total >= 2) {
    finalPages[total - 2].appendChild(allCtas[0]);
  }

  return { originalPages: originalCount, finalPages: total, overflowPages: overflowCount };
};
