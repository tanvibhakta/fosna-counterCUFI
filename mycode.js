//Sections are higher levels of organisation in SquareSpace.
// data-section-id is an identifier for it and does not change.
// We are currently only interested in targeting the content from this one section.
const H1 = '[data-section-id="5ee2523e3dba006e9becb097"] .html-block .sqs-block-content h1';
const H2 = '[data-section-id="5ee2523e3dba006e9becb097"] .html-block .sqs-block-content h2';
const H3 = '[data-section-id="5ee2523e3dba006e9becb097"] .html-block .sqs-block-content h3';
const H4 = '[data-section-id="5ee2523e3dba006e9becb097"] .html-block .sqs-block-content h4';
const IMG = '[data-section-id="5ee2523e3dba006e9becb097"] .sqs-block-image figure';

//Convenience selector for when you want to select all headers
//FIXME: change name of variable to be more indicative of true purpose
//FIXME: Is this even needed?
const all = [H1, H2, H3, H4].join(', ');

//Allows for change of type of expansion icon. Comes from Font Awesome.
//FIXME: change name of variable to be more indicative of true purpose
const icon = "fa fa-caret-right";

/**
 * Given item, this function returns a jQuery object of the block occuring after the item's block.
 * A block is a unit of Squarespace content.
 * @param item Any node inside a block, including the block itself
 * @returns {jQuery} The block immediately after the block item is in.
 */
function nextBlock(item) {
    //sqs-block is a class that defines a Squarespace block
    const $currentBlock =  $(item).closest(".sqs-block");
    return $currentBlock.next();
}

/**
 *
 * @param item
 * @param headers
 */
function closeImg(item, headers) {

    //Any image that comes after it
    let nb = nextBlock(item).slideUp();

    //Paragraphs in the next block until the next heading
    nb = nb.next().children().children().first();
    nb.slideUp();
    nb.nextUntil(headers).slideUp();
    $(item).removeClass("ui-state-active");
    // TODO: delete margins of said hidden image div
}

function toggleImg(item, headers) {

    //Any image that comes after it
    let nb = nextBlock(item).slideToggle();

    //Paragraphs in the next block until the next heading
    nb = nb.next().children().children().first();
    nb.slideToggle();
    nb.nextUntil(headers).slideToggle();
    $(item).toggleClass("ui-state-active");
    // TODO: toggle margins of said hidden image div
}

function closeH4() {

    $(this).nextUntil("h4, h3, h2, h1").slideUp();
    $(this).removeClass("ui-state-active");

    //no end in current block implies there is a new block with image
    if ($(this).nextAll("h4, h3, h2, h1").length == 0) {
        closeImg(this, "h4, h3, h2, h1");
    }
}


function closeH3() {

    //ensure all h4s are closed
    closeH4()
    $(this).nextUntil("h3, h2, h1").slideUp();
    $(this).removeClass("ui-state-active");

    let current = this
    //no end right there
    while ($(current).nextAll("h3, h2, h1").length == 0) {

        //there is an image
        if (nextBlock(current).has("figure")) {
            closeImg(current, "h3, h2, h1");
        }
        if (current.has("h3, h2, h1").length == 0) {
            $(current).children().children().first().nextUntil("h3, h2, h1").slideUp();

        }
        current = $(current).next;
    }
}

/* Toggle state of clicked h4 */
function toggleH4() {
    $(this).nextUntil("h4, h3, h2, h1").slideToggle();
    $(this).toggleClass("ui-state-active");

    //no end in current block implies there is a new block with image
    if ($(this).nextAll("h4, h3, h2, h1").length == 0)
        toggleImg(this, "h4, h3, h2, h1")
}


$(document).ready(function () {

    /* Setup cursors to show over h1, h2, h3, h4 */
    /* Appending the FA icon to every heading */
    $(all).prepend("<i />").css("cursor", "pointer");
    $("i").addClass(icon);

    /* Remove the arrow from the last link TODO: hardcoded, fix */
    $(".html-block .sqs-block-content h2 i").last().removeClass(icon)

    /* Close all tabs to begin with */
    // $(img).slideUp();
    // $(h1).nextUntil("h1").slideUp();
    // $(h2).nextUntil("h2, h1").slideUp();
    // $(h3).nextUntil("h3, h2, h1").slideUp();
    // $(h4).nextUntil("h4, h3, h2, h1").slideUp();
    // $(h3).each(closeH3);
    $(h4).each(closeH4);
    // var b = $(img).parentsUntil(".sqs-block").parent().next().children().children().first();
    // b.slideToggle();
    // b.nextUntil("h4, h3, h2, h1").slideToggle();

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

    $(h3).click(closeH3);
    $(h4).click(toggleH4);

});
