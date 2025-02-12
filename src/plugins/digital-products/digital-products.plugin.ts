import { LanguageCode, PluginCommonModule, VendurePlugin } from '@vendure/core';

import './types';
import { digitalFulfillmentHandler } from './config/digital-fulfillment-handler';
import { digitalOrderProcess } from './config/digital-order-process';
import { digitalShippingEligibilityChecker } from './config/digital-shipping-eligibility-checker';
import { DigitalShippingLineAssignmentStrategy } from './config/digital-shipping-line-assignment-strategy';

/**
 * @description
 * This is an example plugin which demonstrates how to add support for digital products.
 */
@VendurePlugin({
    imports: [PluginCommonModule],
    configuration: config => {
        config.customFields.ProductVariant.push({
            type: 'boolean',
            name: 'isDigital',
            ui: { tab: 'Digital Products'},
            defaultValue: false,
            label: [{ languageCode: LanguageCode.en, value: 'This product is digital' }],
            public: true,
        });
        config.customFields.ProductVariant.push({
            type: 'string',
            list: true,
            name: 'titles',
            ui: { tab: 'Digital Products'},
            label: [{ languageCode: LanguageCode.en, value: 'Title' }],
            public: true,
        });
        config.customFields.ProductVariant.push({
            type: 'string',
            list: true,
            name: 'descriptions',
            ui: { tab: 'Digital Products'},
            label: [{ languageCode: LanguageCode.en, value: 'Description' }],
            public: true,
        });
	   config.customFields.ProductVariant.push({
            type: 'string',
            list: true,
            name: 'mediaUrl',
            ui: { tab: 'Digital Products'},
            label: [{ languageCode: LanguageCode.en, value: 'Media URL' }],
            public: true,
        });
        config.customFields.ProductVariant.push({
            type: 'string',
            list: true,
            name: 'durations',
            ui: { tab: 'Digital Products'},
            label: [{ languageCode: LanguageCode.en, value: 'Duration' }],
            public: true,
        });
        config.customFields.ProductVariant.push({
            type: 'string',
            list: true,
            name: 'posterImages',
            ui: { tab: 'Digital Products'},
            label: [{ languageCode: LanguageCode.en, value: 'Poster Image URL' }],
            public: true,
        });
        config.customFields.ProductVariant.push({
            type: 'string',
            list: true,
            name: 'statuses',
            ui: { tab: 'Digital Products'},
            label: [{ languageCode: LanguageCode.en, value: 'Status' }],
            public: true,
        });
        config.customFields.ProductVariant.push({
            type: 'string',
            list: false,
            name: 'completionCertificate',
            ui: { tab: 'Digital Products'},
            label: [{ languageCode: LanguageCode.en, value: 'Completion Certificate URL' }],
            public: true,
        });
        config.customFields.ShippingMethod.push({
            type: 'boolean',
            name: 'isDigital',
            defaultValue: false,
            label: [
                { languageCode: LanguageCode.en, value: 'This shipping method handles digital products' },
            ],
            public: true,
        });
        config.customFields.Fulfillment.push({
            type: 'string',
            name: 'downloadUrls',
            nullable: true,
            list: true,
            label: [{ languageCode: LanguageCode.en, value: 'Urls of any digital purchases' }],
            public: true,
        });
        config.customFields.Fulfillment.push({
            type: 'string',
            name: 'titles',
            nullable: true,
            list: true,
            label: [{ languageCode: LanguageCode.en, value: 'Titles of any digital purchases' }],
            public: true,
        });
        config.customFields.Fulfillment.push({
            type: 'string',
            name: 'descriptions',
            nullable: true,
            list: true,
            label: [{ languageCode: LanguageCode.en, value: 'Descriptions of any digital purchases' }],
            public: true,
        });
        config.customFields.Fulfillment.push({
            type: 'string',
            name: 'durations',
            nullable: true,
            list: true,
            label: [{ languageCode: LanguageCode.en, value: 'Durations of any digital purchases' }],
            public: true,
        });
        config.customFields.Fulfillment.push({
            type: 'string',
            name: 'statuses',
            nullable: true,
            list: true,
            label: [{ languageCode: LanguageCode.en, value: 'Statuses of any digital purchases' }],
            public: true,
        });
        config.shippingOptions.fulfillmentHandlers.push(digitalFulfillmentHandler);
        config.shippingOptions.shippingLineAssignmentStrategy = new DigitalShippingLineAssignmentStrategy();
        config.shippingOptions.shippingEligibilityCheckers.push(digitalShippingEligibilityChecker);
        config.orderOptions.process.push(digitalOrderProcess);
        return config;
    },
    compatibility: '^2.0.0',
})
export class DigitalProductsPlugin {}
