import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export const extractResumeText = async (
    filePath
) => {
    try {
        // 📄 read file
        const data = new Uint8Array(
            fs.readFileSync(filePath)
        );

        // 📄 load pdf
        const pdf = await pdfjsLib.getDocument({
            data,
        }).promise;

        let text = "";

        // 📄 extract all pages
        for (
            let i = 1;
            i <= pdf.numPages;
            i++
        ) {
            const page =
                await pdf.getPage(i);

            const content =
                await page.getTextContent();

            const strings =
                content.items.map(
                    (item) => item.str
                );

            text += strings.join(" ");
        }

        // 🧹 clean text
        return text
            .replace(/\r\n/g, "\n")
            .replace(/\n{2,}/g, "\n")
            .replace(/[^\x20-\x7E\n]/g, "")
            .trim();

    } catch (err) {
        console.error(
            "RESUME EXTRACTION ERROR:",
            err.message
        );

        throw new Error(
            "Failed to extract resume text"
        );
    }
};