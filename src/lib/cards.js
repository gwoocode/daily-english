import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export function getCategoryData(fileName) {
  const filePath = path.join(process.cwd(), 'src', 'data', `${fileName}.md`);
  
  if (!fs.existsSync(filePath)) {
    return [];
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(fileContents);

  return data.items || [];
}