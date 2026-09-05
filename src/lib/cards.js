import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const dataDirectory = path.join(process.cwd(), 'src/data');

export function getAllDaysData() {
  if (!fs.existsSync(dataDirectory)) return [];

  const fileNames = fs.readdirSync(dataDirectory);
  const mdFiles = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .sort();

  let allCards = [];
  let globalId = 1;

  for (const fileName of mdFiles) {
    const dayMatch = fileName.match(/\d+/);
    const dayNumber = dayMatch ? parseInt(dayMatch[0], 10) : 1;

    const fullPath = path.join(dataDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);

    if (data && Array.isArray(data.items)) {
      data.items.forEach((item) => {
        allCards.push({
          ...item,
          id: globalId++,
          day: dayNumber,
        });
      });
    }
  }

  return allCards;
}