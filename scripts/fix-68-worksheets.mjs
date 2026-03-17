// Replace tracing/coloring worksheets in 6-8 grade packs with age-appropriate types
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const PACKS_DIR = join(process.cwd(), 'data', 'packs');

const files = [
  'academic-vocabulary_vocabulary_pack_6-8_en-es.json',
  'career-life-skills_vocabulary_pack_6-8_en-es.json',
  'lab-reports-scientific-method_vocabulary_pack_6-8_en-es.json',
];

// Age-appropriate replacement worksheets per pack
const replacements = {
  'academic-vocabulary_vocabulary_pack_6-8_en-es.json': {
    tracing: {
      type: 'fill-blank',
      instructions_en: 'Read each sentence. Fill in the blank with the correct academic vocabulary word from the word bank.\nWord Bank: Evidence, Hypothesis, Theory, Argument, Perspective, Differentiate, Interpret, Illustrate, Conclude, Demonstrate',
      instructions_l2: 'Lee cada oración. Completa el espacio en blanco con la palabra de vocabulario académico correcta del banco de palabras.\nBanco de palabras: Evidencia, Hipótesis, Teoría, Argumento, Perspectiva, Diferenciar, Interpretar, Ilustrar, Concluir, Demostrar',
      items: [
        { id: '1', content: 'The scientist formed a ______ before starting the experiment.', content_l2: 'El científico formuló una ______ antes de comenzar el experimento.', correct_answer: 'Hypothesis' },
        { id: '2', content: 'We need strong ______ to support our claims in the essay.', content_l2: 'Necesitamos ______ sólida para respaldar nuestras afirmaciones en el ensayo.', correct_answer: 'Evidence' },
        { id: '3', content: 'Can you ______ between a fact and an opinion?', content_l2: '¿Puedes ______ entre un hecho y una opinión?', correct_answer: 'Differentiate' },
        { id: '4', content: 'The teacher asked us to ______ the meaning of the poem.', content_l2: 'La maestra nos pidió ______ el significado del poema.', correct_answer: 'Interpret' },
        { id: '5', content: 'Please ______ your answer with a diagram or example.', content_l2: 'Por favor, ______ tu respuesta con un diagrama o ejemplo.', correct_answer: 'Illustrate' },
        { id: '6', content: 'After reviewing all the data, we can ______ that the experiment was successful.', content_l2: 'Después de revisar todos los datos, podemos ______ que el experimento fue exitoso.', correct_answer: 'Conclude' },
        { id: '7', content: 'Each student presented their ______ on the topic during the debate.', content_l2: 'Cada estudiante presentó su ______ sobre el tema durante el debate.', correct_answer: 'Perspective' },
        { id: '8', content: 'His ______ was well-organized and included three supporting reasons.', content_l2: 'Su ______ estaba bien organizado e incluía tres razones de apoyo.', correct_answer: 'Argument' },
        { id: '9', content: 'Evolution is a scientific ______ supported by decades of research.', content_l2: 'La evolución es una ______ científica respaldada por décadas de investigación.', correct_answer: 'Theory' },
        { id: '10', content: 'The student was able to ______ her understanding by solving the problem on the board.', content_l2: 'La estudiante pudo ______ su comprensión resolviendo el problema en la pizarra.', correct_answer: 'Demonstrate' },
      ],
    },
    coloring: {
      type: 'categorizing',
      instructions_en: 'Sort the following academic vocabulary words into the correct category. Write each word under the heading where it best fits.',
      instructions_l2: 'Clasifica las siguientes palabras de vocabulario académico en la categoría correcta. Escribe cada palabra debajo del encabezado donde mejor corresponda.',
      items: [
        { id: '1', content: 'Categories: "Thinking Skills" | "Communication Skills" | "Research Skills"' },
        { id: '2', content: 'Words to sort: Analyze, Summarize, Elaborate, Justify, Infer, Evaluate, Synthesize, Compare, Contrast, Interpret, Illustrate, Demonstrate, Conclude, Differentiate, Context, Evidence, Hypothesis, Theory, Argument, Perspective' },
        { id: '3', content: 'Thinking Skills: ___', correct_answer: 'Analyze, Infer, Evaluate, Synthesize, Compare, Contrast, Differentiate, Interpret' },
        { id: '4', content: 'Communication Skills: ___', correct_answer: 'Summarize, Elaborate, Justify, Illustrate, Demonstrate, Argue, Conclude' },
        { id: '5', content: 'Research Skills: ___', correct_answer: 'Context, Evidence, Hypothesis, Theory, Perspective' },
      ],
    },
  },
  'career-life-skills_vocabulary_pack_6-8_en-es.json': {
    tracing: {
      type: 'writing',
      instructions_en: 'Choose 5 vocabulary words from this pack. For each word, write one sentence explaining how this skill could help you in school or in a future job.',
      instructions_l2: 'Elige 5 palabras de vocabulario de este paquete. Para cada palabra, escribe una oración explicando cómo esta habilidad podría ayudarte en la escuela o en un trabajo futuro.',
      items: [
        { id: '1', content: 'Word 1: ____________\nSentence: ____________________________________________________________' },
        { id: '2', content: 'Word 2: ____________\nSentence: ____________________________________________________________' },
        { id: '3', content: 'Word 3: ____________\nSentence: ____________________________________________________________' },
        { id: '4', content: 'Word 4: ____________\nSentence: ____________________________________________________________' },
        { id: '5', content: 'Word 5: ____________\nSentence: ____________________________________________________________' },
      ],
    },
    coloring: {
      type: 'categorizing',
      instructions_en: 'Sort the following life skills into the correct category. Write each word under the heading where it best fits.',
      instructions_l2: 'Clasifica las siguientes habilidades para la vida en la categoría correcta. Escribe cada palabra debajo del encabezado donde mejor corresponda.',
      items: [
        { id: '1', content: 'Categories: "Personal Skills" | "Social Skills" | "Financial Skills" | "Career Skills"' },
        { id: '2', content: 'Words to sort: Responsibility, Teamwork, Problem-solving, Goal Setting, Communication, Budgeting, Career Path, Critical Thinking, Decision Making, Time Management, Interview, Resume, Entrepreneurship, Financial Literacy, Collaboration' },
        { id: '3', content: 'Personal Skills: ___', correct_answer: 'Responsibility, Goal Setting, Critical Thinking, Decision Making, Time Management' },
        { id: '4', content: 'Social Skills: ___', correct_answer: 'Teamwork, Communication, Collaboration' },
        { id: '5', content: 'Financial Skills: ___', correct_answer: 'Budgeting, Financial Literacy' },
        { id: '6', content: 'Career Skills: ___', correct_answer: 'Career Path, Interview, Resume, Entrepreneurship, Problem-solving' },
      ],
    },
  },
  'lab-reports-scientific-method_vocabulary_pack_6-8_en-es.json': {
    tracing: {
      type: 'fill-blank',
      instructions_en: 'Complete each sentence with the correct scientific vocabulary word from the word bank.\nWord Bank: Scientific Method, Hypothesis, Experiment, Independent Variable, Dependent Variable, Data, Analysis, Conclusion, Lab Report, Procedure',
      instructions_l2: 'Completa cada oración con la palabra de vocabulario científico correcta del banco de palabras.\nBanco de palabras: Método Científico, Hipótesis, Experimento, Variable Independiente, Variable Dependiente, Datos, Análisis, Conclusión, Informe de Laboratorio, Procedimiento',
      items: [
        { id: '1', content: 'The ______ is a step-by-step process scientists use to investigate questions.', content_l2: 'El ______ es un proceso paso a paso que los científicos usan para investigar preguntas.', correct_answer: 'Scientific Method' },
        { id: '2', content: 'Before starting the experiment, we wrote a ______ predicting what would happen.', content_l2: 'Antes de comenzar el experimento, escribimos una ______ prediciendo lo que sucedería.', correct_answer: 'Hypothesis' },
        { id: '3', content: 'The thing we changed in the experiment is called the ______.', content_l2: 'Lo que cambiamos en el experimento se llama ______.', correct_answer: 'Independent Variable' },
        { id: '4', content: 'The thing we measured is called the ______.', content_l2: 'Lo que medimos se llama ______.', correct_answer: 'Dependent Variable' },
        { id: '5', content: 'We recorded all our ______ in a table during the experiment.', content_l2: 'Registramos todos nuestros ______ en una tabla durante el experimento.', correct_answer: 'Data' },
        { id: '6', content: 'The ______ section of the lab report explains the steps we followed.', content_l2: 'La sección de ______ del informe de laboratorio explica los pasos que seguimos.', correct_answer: 'Procedure' },
        { id: '7', content: 'After collecting data, we performed an ______ to find patterns.', content_l2: 'Después de recopilar datos, realizamos un ______ para encontrar patrones.', correct_answer: 'Analysis' },
        { id: '8', content: 'Our ______ stated whether the hypothesis was supported or not.', content_l2: 'Nuestra ______ indicó si la hipótesis fue apoyada o no.', correct_answer: 'Conclusion' },
      ],
    },
    coloring: {
      type: 'context-clues',
      instructions_en: 'Read each sentence. Use context clues to figure out which vocabulary word fits best. Write the word on the line.',
      instructions_l2: 'Lee cada oración. Usa las pistas del contexto para determinar qué palabra de vocabulario encaja mejor. Escribe la palabra en la línea.',
      items: [
        { id: '1', content: 'Maria put on her goggles and gloves before entering the lab. She always follows ______ rules.', content_l2: 'María se puso sus gafas y guantes antes de entrar al laboratorio. Ella siempre sigue las reglas de ______.', correct_answer: 'Safety' },
        { id: '2', content: 'The students wrote down everything they saw happening in the beaker. They were making careful ______.', content_l2: 'Los estudiantes anotaron todo lo que vieron suceder en el vaso de precipitados. Estaban haciendo ______ cuidadosas.', correct_answer: 'Observations' },
        { id: '3', content: 'After the experiment, the teacher asked the class to talk about what they learned and share ideas. This part is called the ______.', content_l2: 'Después del experimento, la maestra pidió a la clase que hablaran sobre lo que aprendieron y compartieran ideas. Esta parte se llama la ______.', correct_answer: 'Discussion' },
        { id: '4', content: 'The beakers, test tubes, and thermometers were all listed under the ______ section of the lab report.', content_l2: 'Los vasos de precipitados, tubos de ensayo y termómetros estaban todos listados en la sección de ______ del informe de laboratorio.', correct_answer: 'Materials' },
      ],
    },
  },
};

for (const file of files) {
  const filePath = join(PACKS_DIR, file);
  const pack = JSON.parse(readFileSync(filePath, 'utf-8'));

  const replacement = replacements[file];
  if (!replacement) continue;

  const newWorksheets = [];
  for (const ws of pack.worksheets) {
    if (ws.type === 'tracing' && replacement.tracing) {
      newWorksheets.push(replacement.tracing);
      console.log(`${file}: replaced tracing → ${replacement.tracing.type}`);
    } else if (ws.type === 'coloring' && replacement.coloring) {
      newWorksheets.push(replacement.coloring);
      console.log(`${file}: replaced coloring → ${replacement.coloring.type}`);
    } else {
      newWorksheets.push(ws);
    }
  }

  pack.worksheets = newWorksheets;

  // Also update answer_key to remove tracing/coloring references
  if (pack.answer_key) {
    pack.answer_key = pack.answer_key.filter(ak => {
      const id = ak.worksheet_id;
      // Keep answer keys that aren't for the old tracing/coloring
      return typeof ak.answers !== 'string'; // Remove "No specific answers needed for tracing"
    });
  }

  writeFileSync(filePath, JSON.stringify(pack, null, 2) + '\n');
}

console.log('\nDone. 6-8 grade worksheets updated.');
