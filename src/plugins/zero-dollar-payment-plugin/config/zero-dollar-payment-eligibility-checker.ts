import {
    LanguageCode,
    Logger,
    PaymentMethodEligibilityChecker, 
    TransactionalConnection,
} from "@vendure/core"

let connection: TransactionalConnection;
export const zeroDollarPaymentEligibilityChecker = new PaymentMethodEligibilityChecker({
    code: "zero-dollar-payment-eligibility-checker",
    description: [
        {
            languageCode: LanguageCode.en,
            value: "Eligible for zero-dollar orders",
        },
    ],
    args: {},
    init: injector => {
        connection = injector.get(TransactionalConnection);
    },

    check: async (ctx, order) => {
        //const orderLines = await ActiveOrderService.getActiveOrder(ctx);
        console.log('Zero Dollar Payment eligibility checking');
        console.log('Total Amount: ' + Math.ceil(order.totalWithTax));
        console.log('Order ID: ' + order.id);
        if(Math.ceil(order.totalWithTax) === 0){
	    console.log('Order total is 0');
            return true;
        }else{
            return false;
        }
    },
})
