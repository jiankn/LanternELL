import type { NextApiRequest, NextApiResponse } from 'next';
import { PackDocument } from '@/components/pdf/pack-document';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';

export const config = {
    api: { bodyParser: { sizeLimit: '50mb' } },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { packContent, mode = 'final' } = req.body;

        if (!packContent) {
            return res.status(400).json({ error: 'Missing packContent' });
        }

        const resource = {
            id: packContent.pack_id,
            slug: packContent.pack_id,
            title: packContent.title,
            description: packContent.description,
            pack_type: packContent.pack_type,
            topic: packContent.topic,
            age_band: packContent.age_band,
            language_pair: packContent.language_pair,
        };

        const renderedAt = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        const htmlContent = renderToStaticMarkup(
            <PackDocument
                content={packContent}
                resource={resource}
                mode={mode}
                renderedAt={renderedAt}
                sampleWatermarkText="FREE SAMPLE - LanternELL.com"
            />
        );

        const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        @page { size: letter; margin: 0; }
        .page-break-after { page-break-after: always; }
        .page-break-inside-avoid { page-break-inside: avoid; }
    </style>
</head>
<body>
    ${htmlContent}
</body>
</html>`;

        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(fullHtml);
    } catch (error: any) {
        console.error('Error rendering PDF HTML:', error);
        res.status(500).json({ error: error.message });
    }
}
