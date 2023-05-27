export const entryRequirements = $ => {
  const hasAccessSheffield = $('#js-course-ereq-panel--access_sheffield').length;
  const requirements = {
    standard: {
      grades: $("#js-course-ereq-panel--standard span.grades").text()
    }
  };

  if (hasAccessSheffield) {
    requirements.access = {
      grades: $("#js-course-ereq-panel--access_sheffield span.grades").text()
    }
  }

  // now we have grades lets remove that so we don't repeat content
  $(".course-ereq-panel span.grades").each((index, element) => {
    $(element).remove();
  });

  // get extra requirements if they exist
  $("#js-course-ereq-panel--standard .printonly").remove();
  const standardRequirements = $("#js-course-ereq-panel--standard > p:first-of-type").html();

  if (standardRequirements) {
    const extra = standardRequirements.split("including")[standardRequirements.split('including').length - 1].trim();
    if (extra) {
      requirements.standard.extras = extra;
    }
  }

  $("#js-course-ereq-panel--standard > p:first-of-type, #js-course-ereq-panel--standard .printonly").remove();
  requirements.standard.body = $("#js-course-ereq-panel--standard").html().trim();

  if (hasAccessSheffield) {
    $("#js-course-ereq-panel--access_sheffield .printonly").remove();
    const accessRequirements = $("#js-course-ereq-panel--access_sheffield > p").html();

    const extra = accessRequirements.split("including")[standardRequirements.split('including').length - 1].trim();
    if (extra) {
      requirements.access.extras = extra;
    }

    $("#js-course-ereq-panel--access_sheffield > p:first-of-type, #js-course-ereq-panel--access_sheffield .printonly").remove();
    requirements.access.body = $("#js-course-ereq-panel--access_sheffield").html().trim();;
  }

  return requirements;
}