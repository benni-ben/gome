// backend for webhook on discord
exports.handler = async (event) => {
    const webhookUrl = "https://discord.com/api/webhooks/1450866106779697284/H5OjFE1bb9xi18mXxRDwASBvi0D3sjxNpuxSfnqa42IuMil8PdpfspoaCx1Yr2kQnjI6";
    const { feedback } = JSON.parse(event.body);

    try {
        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            avatar_url: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cG90YXRvfGVufDB8fDB8fHww",
            body: JSON.stringify({
                username: "Gomebot",
                embeds: [{
                    title: "New feedback",
                    description: feedback,
                    color: 5814783
                }]
            })
        });

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ success: true })
        };
    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ error: error.message })
        };
    }
};