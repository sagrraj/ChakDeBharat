const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = "VaaniCallerProfiles";

exports.handler = async (event) => {

    console.log("EVENT:", JSON.stringify(event));

    if (
        event.rawPath === '/state' ||
        event.path === '/state' ||
        event.requestContext?.http?.path === '/state'
    ) {
        const activeCalls = [
            { id: 1, name: "Alice", status: "In Call", summary: "Asking about order status" },
            { id: 2, name: "Bob", status: "Waiting", summary: "Wants to update profile" }
        ];

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                activeCalls,
                message: "Working"
            })
        };
    }

    if (!event.function) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Invalid request" })
        };
    }

    const { actionGroup, function: functionName, parameters, sessionId } = event;
    const phone = event.sessionAttributes?.phoneNumber || "unknown_caller";

    try {
        if (functionName === "get_customer_profile") {
            const profile = await getProfile(phone);
            return formatResponse(event, profile ? profile : { message: "New customer. No profile found." });
        }

        if (functionName === "update_call_summary") {
            const summary = parameters?.find(p => p.name === "summary")?.value;
            const name = parameters?.find(p => p.name === "name")?.value;
            await updateProfile(phone, { name, lastCallSummary: summary });

            return formatResponse(event, { status: "Success", message: "Profile updated and owner notified." });
        }

        if (functionName === "check_order_status") {
            const orderId = parameters?.find(p => p.name === "orderId")?.value;
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
                TEXT: {
                    body: JSON.stringify(responseBody)
                }
            }
        }
    };
}