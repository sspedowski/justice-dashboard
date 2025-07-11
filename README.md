# Justice Dashboard

> Open-source legal document analysis tool with AI-driven tagging and summaries.

# Justice Dashboard

A legal-tech tool for organizing and summarizing case documents, powered by OpenAI GPT-4 and scripture-aligned legal responses.

## Features

- Upload and summarize legal PDFs
- Auto-detect key legal issues and tags (e.g., due process, CPS misconduct)
- Export summaries and tags to CSV
- Store prayer/intent for each case
- Ask LawGPT for legal and Bible-based perspective

## Setup

```bash
npm install
```

Create a `.env` file in the root:

```
OPENAI_API_KEY=your-key-here
PORT=3000
```

Run the server:

```bash
npm start
```

Then visit [http://localhost:3000](http://localhost:3000)

## Legal Notes

This project is released under the [MIT License](./LICENSE).  
All AI-assisted code was reviewed and assembled by the project author.  
Some parts of the logic (e.g., file upload, CSV export) may resemble standard implementations from public tutorials or GitHub repositories.

If any portions appear similar to external sources, they are functionally generic and used under fair and standard development practices.

## Credits

- PDF parsing: [pdf-parse](https://www.npmjs.com/package/pdf-parse)
- AI summarization: [OpenAI API](https://platform.openai.com/)
- Scripture/legal alignment via LawGPT endpoint

## Version History
- **v1.0.0**: Initial release with core document processing features        
- Bulk PDF upload and processing
- Auto-categorization and child detection
- Misconduct type classification
- CSV export functionality
- Production-ready Tailwind CSS build

---

## 🤝 Contributing

We welcome community contributions! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🛡 License

This project is licensed under the [MIT License](LICENSE).

## 📧 Support

For questions or support, please open an issue on GitHub.