import {
    dummyPaymentHandler,
    DefaultJobQueuePlugin,
    DefaultSearchPlugin,
    VendureConfig,
    LanguageCode,
} from '@vendure/core';
import { defaultEmailHandlers, EmailPlugin } from '@vendure/email-plugin';
import { AssetServerPlugin } from '@vendure/asset-server-plugin';
import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
import { compileUiExtensions, setBranding } from '@vendure/ui-devkit/compiler';
import 'dotenv/config';
import path from 'path';
import { BecknVendurePlugin } from './plugins/beckn-vendure-plugin/src/beckn-vendure-plugin';
import { CreateSellerPlugin } from "./plugins/create-seller-plugin/create-seller.plugin";
import { ReviewsPlugin } from "./plugins/reviews/reviews-plugin";
import { MpesaPlugin } from "vendure-mpesa-plugin";
import { DigitalProductsPlugin } from './plugins/digital-products/digital-products.plugin';
import { CoDPlugin } from "./plugins/cod-payment-plugin/cod-payment-plugin";
import { ZeroDollarPaymentPlugin } from './plugins/zero-dollar-payment-plugin/zero-dollar-payment-plugin';
import { zeroDollarPaymentEligibilityChecker } from "./plugins/zero-dollar-payment-plugin/config/zero-dollar-payment-eligibility-checker"
import { mpesaEligibilityChecker } from "vendure-mpesa-plugin/dist/config/mpesa-eligibility-checker";
import { codEligibilityChecker } from './plugins/cod-payment-plugin/config/cod-eligibility-checker';

const IS_DEV = process.env.APP_ENV === 'dev';

export const config: VendureConfig = {
    apiOptions: {
	hostname: 'dev-bpp-app.kuza.one',
        port: 3000,
        adminApiPath: 'admin-api',
        shopApiPath: 'shop-api',
        // The following options are useful in development mode,
        // but are best turned off for production for security
        // reasons.
        ...(IS_DEV ? {
            adminApiPlayground: {
                settings: { 'request.credentials': 'include' },
            },
            adminApiDebug: true,
            shopApiPlayground: {
                settings: { 'request.credentials': 'include' },
            },
            shopApiDebug: true,
        } : {}),
    },
    authOptions: {
        tokenMethod: ['bearer', 'cookie'],
        superadminCredentials: {
            identifier: process.env.SUPERADMIN_USERNAME,
            password: process.env.SUPERADMIN_PASSWORD,
        },
        cookieOptions: {
          secret: process.env.COOKIE_SECRET,
        },
    },
    dbConnectionOptions: {
        type: 'better-sqlite3',
        // See the README.md "Migrations" section for an explanation of
        // the `synchronize` and `migrations` options.
        synchronize: true,
        migrations: [path.join(__dirname, './migrations/*.+(js|ts)')],
        logging: false,
       database: path.join(__dirname, '../vendure.sqlite'),
	/*type: 'postgres',
	host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'winterinmarch12#',
        database: 'vendure',*/
    },
    paymentOptions: {
        paymentMethodHandlers: [dummyPaymentHandler],
	paymentMethodEligibilityCheckers: [codEligibilityChecker,zeroDollarPaymentEligibilityChecker,mpesaEligibilityChecker],
    },
    // When adding or altering custom field definitions, the database will
    // need to be updated. See the "Migrations" section in README.md.
    customFields: {
        OrderLine: [{
            name: 'timeSlot',
            type: 'datetime',
            nullable: true,
            ui: {
                component: 'date-form-input'
            },
            label: [
                {languageCode: LanguageCode.en, value: 'Time Slot'}
            ]
        }]
	},
    plugins: [
        AssetServerPlugin.init({
            route: 'assets',
            assetUploadDir: path.join(__dirname, '../static/assets'),
            // For local dev, the correct value for assetUrlPrefix should
            // be guessed correctly, but for production it will usually need
            // to be set manually to match your production url.
            assetUrlPrefix: IS_DEV ? undefined : 'https://dev-bpp-app.kuza.one/assets/',
        }),
        DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
        DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),
        EmailPlugin.init({
            devMode: true,
            outputPath: path.join(__dirname, '../static/email/test-emails'),
            route: 'mailbox',
            handlers: defaultEmailHandlers,
            templatePath: path.join(__dirname, '../static/email/templates'),
            globalTemplateVars: {
                // The following variables will change depending on your storefront implementation.
                // Here we are assuming a storefront running at http://localhost:8080.
                fromAddress: '"example" <noreply@example.com>',
                verifyEmailAddressUrl: 'http://localhost:3030/verify',
                passwordResetUrl: 'http://localhost:3030/password-reset',
                changeEmailAddressUrl: 'http://localhost:3030/verify-email-address-change'
            },
        }),
        AdminUiPlugin.init({
            route: 'admin',
            port: 3002,
            adminUiConfig: {
		apiHost: 'https://dev-bpp-app.kuza.one',
                apiPort: 443,
            }
        }),
	BecknVendurePlugin.init({
            bpp_protocol_server_base_url: 'https://dev-bpp-client.kuza.one',
            bpp_id: 'dev-bpp-network.kuza.one',
            bpp_uri: 'https://dev-bpp-network.kuza.one',
            bpp_country: 'Kenya',
            bpp_city: 'Kirinyaga',
	    transformationsFolder: path.join(__dirname, "plugins", "beckn-vendure-plugin", "transformations"),
        }),
	 MpesaPlugin.init({
            consumerKey: "N7bHyP7N1GwICA87Cs3yeiJbe5ZFMAWmGJrVeqvN5bxlObvE",
            consumerSecret: "em5hwji9nz4NUJstWw7n1sDSbh5W3uvgg9K2z7DFaux3rJ9GULgn7tZCYufBegSB",
            shortCode: "174379",
            shortCodeType: "paybill",
            passkey: "G3be/gVUpoZ7XcHdPzmaglIBVyln3gOR1aVyhg4RSxS+Ow9wNFvkSnpt8AG6v+v9v2es2cBa/EfJvJ3JmfNEBxKADbQopjoXMe0jMym41kf5ejMQtT9MzPA2NtiZvrEbNG8EKKbAcbK8vwtU8H2AamcJOQkZEAUDEpEPVlj3eLWS+cZi7XbAP1O1J4Gz3K58wUuvHWo9e35imcUMdOfdtHjgXqrY521s6JcOq8gLfmakEeH9aiQlaOS809PA0eYTnAUDQ7Fx4J7dwNnbimKlGSbOM9vLAeyIMMamwOzubx6gBr6M9HgaIVct0ALSRpb5bBmAkKyYuVssvp5TN3r6AQ==",
            environment: "sandbox",
            vendureHost: "https://dev-bpp-app.kuza.one",
        }),
	CreateSellerPlugin,
	ReviewsPlugin,
	DigitalProductsPlugin,
	CoDPlugin,
	ZeroDollarPaymentPlugin,
    ],
};
