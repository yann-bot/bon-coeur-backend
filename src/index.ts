import app from "./server";
import "dotenv/config"

const PORT = Number(process.env.PORT) || 3000;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})

