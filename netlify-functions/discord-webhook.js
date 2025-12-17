exports.handler = async (event) => {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    const { feedback } = JSON.parse(event.body);
    try {
        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: "Gomebot",
                embed: [
                    {
                        title: "New feedback",
                        description: feedback,
                        color: 5814783
                    }
                ]

            })
        });
        return {
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ success: true })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: error.message })
        };
    }
};