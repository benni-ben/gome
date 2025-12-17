exports.handler = async (event) => {
    const webhookUrl = "https://discord.com/api/webhooks/1450866106779697284/H5OjFE1bb9xi18mXxRDwASBvi0D3sjxNpuxSfnqa42IuMil8PdpfspoaCx1Yr2kQnjI6";
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