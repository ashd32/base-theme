/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

/**
 * Checks whether every option is in parameters
 * @param {Object} parameters
 * @param {{ attribute_code: string }[]} options
 * @returns {boolean}
 */
const checkEveryOption = (attributes, options) => Object.keys(options)
    .every((option) => {
        if (typeof options[option] === 'string') {
            return options[option] === attributes[option].attribute_value;
        }

        return options[option].includes(attributes[option].attribute_value);
    });

/**
 * Get parameters for product variant from varian attributes
 * @param {{ attribute_code: string, attribute_value: string }[]} variantAttributes
 * @param {string[]} requiredParams
 * @returns {Object}
 */
export const generateParameters = (variantAttributes, requiredParams) => {
    const parameters = variantAttributes.reduce((accum, { attribute_code, attribute_value }) => (
        requiredParams.includes(attribute_code)
            ? {
                ...accum,
                [attribute_code]: attribute_value
            }
            : accum),
    {});
    return parameters;
};

/**
 * Append product variant with parameters
 * @param {Object} variant
 * @param {string[]} requiredParameters
 * @returns {Object}
 */
const getVariantWithParams = (variant, requiredParameters) => {
    const { product, product: { attributes } } = variant;

    return {
        ...variant,
        product: {
            ...product,
            parameters: generateParameters(attributes, requiredParameters)
        }
    };
};

/**
 * Get product variant index by options
 * @param {Object[]} variants
 * @param {{ attribute_code: string }[]} options
 * @returns {number}
 */
export const getVariantIndex = (variants, options) => +Object.keys(variants)
    .find(i => checkEveryOption(variants[i].attributes, options));

/**
 * Append product variants with parameters
 * @param {Object[]} variants
 * @param {{ attribute_code: string }[]} configurable_options
 * @returns {Object[]}
 */
export const getVariantsWithParams = (variants, configurable_options) => {
    const requiredParameters = configurable_options.map(({ attribute_code }) => attribute_code);
    return variants.map(variant => getVariantWithParams(variant, requiredParameters));
};

/**
 * Get product's brand from attributes
 * @param {{ attribute_value: string, attribute_code: string }} attributes
 * @returns {string}
 */
export const getBrand = (attributes) => {
    const { attribute_value } = attributes.find(({ attribute_code }) => attribute_code === 'brand');
    return attribute_value;
};
