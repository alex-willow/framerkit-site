export default function InstallationContent() {
    return (
      <div style={{ padding: "60px 20px", maxWidth: 900, margin: "0 auto" }}>
        <h1>Installation</h1>
        <p>
          Делай установку легко и быстро, используя инструкции ниже.
        </p>
  
        <div style={{ marginTop: 30 }}>
          <h2>Установка</h2>
          <pre
            style={{
              background: "#f0f0f0",
              padding: "15px",
              borderRadius: 8,
              overflowX: "auto",
            }}
          >
  {`npm install framer-kit
  # или
  yarn add framer-kit`}
          </pre>
        </div>
      </div>
    );
  }
  