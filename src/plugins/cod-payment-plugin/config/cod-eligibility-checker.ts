import {
    LanguageCode,
    Logger,
    PaymentMethodEligibilityChecker,
    OrderLine, 
    ActiveOrderService, 
    TransactionalConnection,
} from "@vendure/core"

let connection: TransactionalConnection;
export const codEligibilityChecker = new PaymentMethodEligibilityChecker({
    code: "cod-eligibility-checker",
    description: [
        {
            languageCode: LanguageCode.en,
            value: "Check whether the order supports the Cash on Delivery",
        },
    ],
    args: {},
    init: injector => {
        connection = injector.get(TransactionalConnection);
    },

    check: async (ctx, order) => {
        //const orderLines = await ActiveOrderService.getActiveOrder(ctx);
        console.log('CoD eligibility checking');
        const digitalOrderLines = order.lines.filter(l => l.productVariant.customFields.isDigital);
        console.log('CoD - digitalOrderLines: ' + digitalOrderLines.length);
	if(digitalOrderLines.length > 0 || Math.ceil(order.totalWithTax) === 0) {
	    console.log('CoD - this is a digital order');
            return false;
        } else {
            return true;
        }
    },
})
