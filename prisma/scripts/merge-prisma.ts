import fs from 'fs';
import path from 'path';

const prismaDir = path.resolve('prisma');
const outputFile = path.join(prismaDir, 'schema.prisma');

// urutan penting: base dulu, lalu enums, lalu model-model
const filesOrder = [
  'base.prismapart',
  'enums.prismapart',
  'user.prismapart',
  'order.prismapart',
  'menu.prismapart',
  'table.prismapart',
  'reward.prismapart',
];

function mergeSchemas() {
  let content = '';

  for (const file of filesOrder) {
    const filePath = path.join(prismaDir, file);

    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ File ${file} tidak ditemukan, dilewati.`);
      continue;
    }

    const part = fs.readFileSync(filePath, 'utf8');
    content += `\n// ===== ${file} =====\n\n${part}\n`;
  }

  fs.writeFileSync(outputFile, content.trim() + '\n');
  console.log(`✅ schema.prisma berhasil dibuat di ${outputFile}`);
}

mergeSchemas();
