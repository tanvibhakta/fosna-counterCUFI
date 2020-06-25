const h1 = '[data-section-id="5ee2523e3dba006e9becb097"] .html-block .sqs-block-content h1';
const h2 = '[data-section-id="5ee2523e3dba006e9becb097"] .html-block .sqs-block-content h2';
const h3 = '[data-section-id="5ee2523e3dba006e9becb097"] .html-block .sqs-block-content h3';
const h4 = '[data-section-id="5ee2523e3dba006e9becb097"] .html-block .sqs-block-content h4';
const img = '[data-section-id="5ee2523e3dba006e9becb097"] .sqs-block-image figure';

const all = [h1, h2, h3, h4].join(', ');

const icon = "fa fa-caret-right";

/* Toggle state of clicked h4 */
function toggleH4() {

    //contains image
    if ($(this).nextAll("h4, h3, h2, h1").length == 0) {

        $(this).nextUntil("h4, h3, h2, h1").slideToggle();

        //Any image that comes after it
        $(this).parentsUntil(".sqs-block").parent().next().slideToggle();

        //Paragraphs in the next block until the next heading
        const newBlock = $(this).parentsUntil(".sqs-block").parent().next().next().children().children().first();
        newBlock.slideToggle();
        newBlock.nextUntil("h4, h3, h2, h1").slideToggle();
        $(this).toggleClass("ui-state-active");
        // TODO: delete margins of said hidden image div
    } else {
        closeItem(this);
    }
}

function closeItem(item) {
    $(this).nextUntil("h4, h3, h2, h1").slideUp();
    $(this).removeClass("ui-state-active");
}

$(document).ready(function () {

    /* Setup cursors to show over h1, h2, h3, h4 */
    /* Appending the FA icon to every heading */
    $(all).prepend("<i />").css("cursor", "pointer");
    $("i").addClass(icon);

    /* Remove the arrow from the last link TODO: hardcoded, fix */
    $(".html-block .sqs-block-content h2 i").last().removeClass(icon)

    /* Close all tabs to begin with */
    $(img).slideUp();
    $(h1).nextUntil("h1").slideUp();
    $(h2).nextUntil("h2, h1").slideUp();
    $(h3).nextUntil("h3, h2, h1").slideUp();
    $(h4).nextUntil("h4, h3, h2, h1").slideUp();
    var b = $(img).parentsUntil(".sqs-block").parent().next().children().children().first();
    b.slideToggle();
    b.nextUntil("h4, h3, h2, h1").slideToggle();

    //Open h3 subheadings as well
    // $(h3).slideDown();

    /* Toggle state of clicked h2 */
    $(h2).click(function () {
        $(this).nextUntil("h4, h3, h2, h1").slideToggle();
        $(this).toggleClass("ui-state-active");
    });

    /* Toggle state of clicked h3 */
    $(h3).click(function () {
        $(this).nextUntil("h4, h3, h2, h1").slideToggle();
        $(this).toggleClass("ui-state-active");

        //Toggle appearance of h4
        $(this).nextUntil("h3").next("h4").slideToggle();
    });


    $(h4).click(toggleH4);

});
