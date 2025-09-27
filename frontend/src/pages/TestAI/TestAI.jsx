import React, { useState } from "react";
import axiosInstance from '../../utils/axiosInstance';

const TestAI = () => {
    const [message, setMessage] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.post("concour/ai/", { message });
            setResponse(res.data.response);
        } catch (err) {
            setResponse("Error: " + (err.response?.data?.error || "Could not get response"));
        }
        setLoading(false);
    };

    return (
        <div style={{ maxWidth: 400, margin: "2rem auto", padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
            <h2>Test AI</h2>
            <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={4}
                style={{ width: "100%", marginBottom: 10 }}
                placeholder="Type your message..."
            />
            <button onClick={handleSend} disabled={loading || !message}>
                {loading ? "Sending..." : "Send"}
            </button>
            {response && (
                <div style={{ marginTop: 20 }}>
                    <strong>AI Response:</strong>
                    <div>{response}</div>
                </div>
            )}
        </div>
    );
};

export default TestAI;
