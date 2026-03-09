const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// 指向 app-demo 的图片目录
const dir = path.join(__dirname, 'source/app-demo/image');

async function compressImages() {
    console.log('🚀 开始压缩图片...');
    const files = fs.readdirSync(dir);
    let totalSaved = 0;

    for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        // 如果是 png 或 jpg 则进行压缩
        if (['.png', '.jpg', '.jpeg'].includes(ext)) {
            const filePath = path.join(dir, file);
            const tempPath = path.join(dir, 'temp_' + file);
            const statsBefore = fs.statSync(filePath);
            
            try {
                if (ext === '.png') {
                    // PNG 提供高强度无损/微损压缩
                    await sharp(filePath).png({ quality: 80, compressionLevel: 9 }).toFile(tempPath);
                } else {
                    // JPG 质量降至 80% (对于视网膜屏截图画质影响极小，但体积直降)
                    await sharp(filePath).jpeg({ quality: 80 }).toFile(tempPath);
                }
                
                const statsAfter = fs.statSync(tempPath);
                const saved = statsBefore.size - statsAfter.size;
                
                if (saved > 0) {
                    // 覆盖原文件
                    fs.renameSync(tempPath, filePath);
                    totalSaved += saved;
                    console.log(`✅ [成功] ${file} - 节省了 ${(saved / 1024).toFixed(2)} KB`);
                } else {
                    // 如果越压越大（说明已经是极限），丢弃临时文件
                    fs.unlinkSync(tempPath);
                    console.log(`⚡ [跳过] ${file} 已经是最佳状态`);
                }
            } catch (e) {
                console.error(`❌ [失败] ${file}:`, e.message);
                if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath); // 清理出错的临时文件
            }
        }
    }
    console.log(`\n🎉 压缩完成！共计为你节省了 ${(totalSaved / 1024 / 1024).toFixed(2)} MB 的流量！`);
}

compressImages();
