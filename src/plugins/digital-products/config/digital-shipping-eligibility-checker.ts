import { LanguageCode, ShippingEligibilityChecker } from '@vendure/core';

export const digitalShippingEligibilityChecker = new ShippingEligibilityChecker({
    code: 'digital-shipping-eligibility-checker',
    description: [
        {
            languageCode: LanguageCode.en,
            value: 'Allows only orders that contain at least 1 digital product',
        },
    ],
    args: {},
    check: (ctx, order, args) => {
        const digitalOrderLines = order.lines.filter(l => l.productVariant.customFields.isDigital);
        console.log('Digital product shipping eligibility checking');
        console.log(digitalOrderLines.length);
        return digitalOrderLines.length > 0;
    },
});
