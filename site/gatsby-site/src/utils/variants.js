const VARIANT_STATUS = {
  unreviewed: 'variant:unreviewed',
  approved: 'variant:approved',
  rejected: 'variant:rejected',
};

/**
 * Variant review status
 * @readonly
 * @enum {string}
 */
module.exports.VARIANT_STATUS = VARIANT_STATUS;

module.exports.getVariantStatus = (variant) => {
  if (variant.tags.includes(VARIANT_STATUS.approved)) {
    return VARIANT_STATUS.approved;
  }
  if (variant.tags.includes(VARIANT_STATUS.rejected)) {
    return VARIANT_STATUS.rejected;
  }
  if (variant.tags.includes(VARIANT_STATUS.unreviewed)) {
    return VARIANT_STATUS.unreviewed;
  }

  return VARIANT_STATUS.unreviewed;
};

module.exports.getVariantStatusText = (tag) => {
  return Object.keys(VARIANT_STATUS).find((key) => VARIANT_STATUS[key] === tag);
};
