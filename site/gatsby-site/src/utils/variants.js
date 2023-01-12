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

module.exports.isCompleteReport = (report) => {
  return (
    report.authors &&
    report.authors.length > 0 &&
    report.description &&
    report.description != '' &&
    report.epoch_date_downloaded &&
    report.epoch_date_downloaded != '' &&
    report.epoch_date_modified &&
    report.epoch_date_modified != '' &&
    report.epoch_date_published &&
    report.epoch_date_published != '' &&
    report.epoch_date_submitted &&
    report.epoch_date_submitted != '' &&
    report.image_url &&
    report.image_url != '' &&
    report.language &&
    report.language != '' &&
    report.source_domain &&
    report.source_domain != '' &&
    report.submitters &&
    report.submitters.length > 0 &&
    report.title &&
    report.title != '' &&
    report.text &&
    report.text != '' &&
    report.plain_text &&
    report.plain_text != '' &&
    report.url &&
    report.url != '' &&
    report.cloudinary_id &&
    report.cloudinary_id != ''
  );
};

module.exports.hasVariantData = (report) => {
  return (
    (report.text_inputs && report.text_inputs != '') ||
    (report.text_outputs && report.text_outputs != '')
  );
};
