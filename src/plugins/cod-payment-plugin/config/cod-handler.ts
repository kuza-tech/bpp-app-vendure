import {
    CreatePaymentResult,
    Injector,
    LanguageCode,
    PaymentMethodHandler,
} from "@vendure/core"

function generateGUID(): string {
    const timestamp = new Date().getTime();
    const randomNum = Math.floor(Math.random() * 1000000);
    return `${timestamp}-${randomNum}`;
}

export const codPaymentMethodHandler = new PaymentMethodHandler({
    code: "cash-on-delivery",
    description: [
        { languageCode: LanguageCode.en, value: "Cash on Delivery" },
    ],
    args: {},
    
    createPayment: async (_, order, amount): Promise<CreatePaymentResult> => {
        return {
            amount: order.totalWithTax,
            state: "Created",
            transactionId: generateGUID(),
        }
    },
    settlePayment: async () => {
        return {
            success: true,
        }
    },

    
})