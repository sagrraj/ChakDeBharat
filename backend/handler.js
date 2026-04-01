const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = "VaaniCallerProfiles";

/**
 * Bedrock Agent Action Group Handler
 */
exports.handler = async (event) => {
    // =====================================================================
    // 🔴 YOUR NEW FRONTEND CODE: Intercept API Gateway requests from React 
    // =====================================================================
    if (event.rawPath === '/state') {
        // Note: Make sure '/state' matches the Route path you created in API Gateway!

        // Mock data to get your frontend unblocked immediately
        // Later, you can grab this from DynamoDB if you have time!
        const activeCalls = [
            { id: 1, name: "Alice", status: "In Call", summary: "Asking about order status" },
            { id: 2, name: "Bob", status: "Waiting", summary: "Wants to update profile" }
        ];

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*", // Crucial for React local development!
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                activeCalls: activeCalls,
                message: "Successfully fetched from API Gateway!"
            })
        };
    }

    // =====================================================================
    // 🔵 YOUR TEAMMATE'S ORIGINAL BEDROCK CODE (Untouched)
    // =====================================================================
    const { actionGroup, function: functionName, parameters, inputText, sessionId } = event;
    const phone = event.sessionAttributes?.phoneNumber || "unknown_caller";

    console.log(`Executing ${functionName} for session ${sessionId}`);

    try {
        if (functionName === "get_customer_profile") {
            const profile = await getProfile(phone);
            return formatResponse(event, profile ? profile : { message: "New customer. No profile found." });
        }

        if (functionName === "update_call_summary") {
            const summary = parameters.find(p => p.name === "summary")?.value;
            const name = parameters.find(p => p.name === "name")?.value;
            await updateProfile(phone, { name, lastCallSummary: summary });

            // Mock WhatsApp trigger
            console.log(`[WHATSAPP] Sending summary to owner: ${summary}`);

            return formatResponse(event, { status: "Success", message: "Profile updated and owner notified." });
        }

        if (functionName === "check_order_status") {
            const orderId = parameters.find(p => p.name === "orderId")?.value;
            // Mock order logic
            const status = orderId === "12345" ? "Delivered" : "In Transit (Out for delivery)";
            return formatResponse(event, { orderId, status, eta: "Today by 6 PM" });
        }

        return formatResponse(event, { error: "Function not found" });

    } catch (err) {
        console.error(err);
        return formatResponse(event, { error: "Internal error processing tool request." });
    }
};

async function getProfile(phoneNumber) {
    const res = await docClient.send(new GetCommand({
        TableName: TABLE_NAME,
        Key: { PhoneNumber: phoneNumber }
    }));
    return res.Item;
}

async function updateProfile(phoneNumber, { name, lastCallSummary }) {
    await docClient.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: {
            PhoneNumber: phoneNumber,
            Name: name,
            LastCallSummary: lastCallSummary,
            LastUpdated: new Date().toISOString()
        }
    }));
}

function formatResponse(event, responseBody) {
    return {
        actionGroup: event.actionGroup,
        function: event.function,
        functionResponse: {
            responseBody: {
                "TEXT": {
                    body: JSON.stringify(responseBody)
                }
            }
        }
    };
}