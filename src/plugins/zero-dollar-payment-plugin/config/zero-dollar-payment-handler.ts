import {
    CreatePaymentResult,
    LanguageCode,
    PaymentMethodHandler,
    OrderService,
} from "@vendure/core";

let orderService: OrderService;
function generateGUID(): string {
    const timestamp = new Date().getTime();
    const randomNum = Math.floor(Math.random() * 1000000);
    return `${timestamp}-${randomNum}`;
}

export const zeroDollarPaymentMethodHandler = new PaymentMethodHandler({
    init(injector) {
        orderService = injector.get(OrderService);
    },
    code: "zero-dollar-payment",
    description: [
        { languageCode: LanguageCode.en, value: "Zero Dollar Payment" },
    ],
    args: {},
    
    createPayment: async (ctx, order, amount): Promise<CreatePaymentResult> => {
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
