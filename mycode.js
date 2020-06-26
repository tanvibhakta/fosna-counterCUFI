//Sections are higher levels of organisation in SquareSpace.
// data-section-id is an identifier for it and does not change.
// We are currently only interested in targeting the content from this one section.
const H1 = '[data-section-id="5ee2523e3dba006e9becb097"] .html-block .sqs-block-content H1';
const H2 = '[data-section-id="5ee2523e3dba006e9becb097"] .html-block .sqs-block-content H2';
const H3 = '[data-section-id="5ee2523e3dba006e9becb097"] .html-block .sqs-block-content H3';
const H4 = '[data-section-id="5ee2523e3dba006e9becb097"] .html-block .sqs-block-content H4';
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
    const $currentBlock = $(item).closest(".sqs-block");
    return $currentBlock.next();
}

/**
 * This function closes the image present in the content of the item passed,
 * as well as the following items, until it reaches the next header
 * @param item Any node inside a block
 * @param headers A selector that is a string of headers in descending order of priority
 *                that the function looks for to find a closing case
 */
function toggleImg(item, headers) {

    //Any image that comes after it
    //Fixme: give me a reasonable variable name?
    let nb = nextBlock(item).slideToggle();

    //Paragraphs in the next block until the next heading
    nb = nextBlock(nb).children().children().first();
    nb.slideToggle();
    nb.nextUntil(headers).slideToggle();
    // TODO: toggle margins of said hidden image div
}

/**
 * This function takes a header and returns a list of headers that the blocks
 * need to toggle items until, sorted in decreasing order of priority
 * @param header A node
 * @returns {string} A list of headers, sorted in decreasing order of priority
 */
function constructHeaderSelector(header) {
    //Fixme: must check if items are things other than h1, h2 , h3, h4!
    //Fixme: better variable name!!
    let b = [H4, H3, H2, H1];
    const index = b.map(element => element.includes(header.nodeName) ? b.indexOf(element) : null).filter(element => element != null).slice(-1)[0]
    return b.slice(index).join(", ");
}

/**
 * Given a header, will skip through blocks, closing them, until it
 * reaches the one of the appropriate headers at which to stop
 * @param header A Node that is one of ("h1, h2, h3, h4")
 *
 */
function toggle(header) {
    //Fixme: must check if items are things other than h1, h2 , h3, h4!
    $(header).toggleClass("ui-state-active");

    // header
    //     - Check where the next header is
    //         - toggle all the nodes under it until header
    //         - if next header not reached, skip to the next block
    //         - keep skipping until the header is reached

    let toggleables = [];
    let headerSelector = constructHeaderSelector(header);

    let $c = $(header).nextAll();

    //There's an infinite loop here 
    while ($c.has(headerSelector).length == 0) {
        toggleables.push($c)
        $c = nextBlock(header)
    }
    toggleables.push($c.first());
    toggleables.push($c.first().nextUntil(headerSelector));

    toggleables.forEach(node => $(node).slideToggle());

// while ($(item).nextUntil(headers).length == 0) {
//     $(item).nextAll(headers).slideUp();
// }
//
// //Any image that comes after it
// //Fixme: give me a reasonable variable name?
// let nb = nextBlock(item).slideToggle();
//
// //Paragraphs in the next block until the next heading
// nb = nextBlock(nb).children().children().first();
// nb.slideToggle();
// nb.nextUntil(headers).slideToggle();
// // TODO: toggle margins of said hidden image div
//

}

function closeH4() {

    $(this).nextUntil("H4, H3, H2, H1").slideUp();
    $(this).removeClass("ui-state-active");

    //no end in current block implies there is a new block with image
    if ($(this).nextAll("H4, H3, H2, H1").length == 0) {
        toggleImg(this, "H4, H3, H2, H1");
    }
}


function closeH3() {

    //ensure all h4s are closed
    closeH4()
    $(this).nextUntil("H3, H2, H1").slideUp();
    $(this).removeClass("ui-state-active");

    let current = this
    console.log("1", current);
    //no end right there
    while ($(current).length != 0 && $(current).nextAll("H3, H2, H1").length == 0) {

        console.log("2", current);
        //there is an image
        if (nextBlock(current).has("figure")) {
            toggleImg(current, "H3, H2, H1");
            current = $(current).next();
            console.log("3", current);
        }
        if (current.has("H3, H2, H1").length == 0) {
            $(current).children().slideUp();
        } else {
            $(current).children().children().first().nextUntil("H3, H2, H1").slideUp();
        }
        current = $(current).next();
        console.log("4", current);

    }
}

/* Toggle state of clicked H4 */
function toggleH4() {
    $(this).nextUntil("H4, H3, H2, H1").slideToggle();
    $(this).toggleClass("ui-state-active");

    //no end in current block implies there is a new block with image
    if ($(this).nextAll("H4, H3, H2, H1").length == 0)
        toggleImg(this, "H4, H3, H2, H1")
}


$(document).ready(function () {

    /* Setup cursors to show over H1, H2, H3, H4 */
    /* Appending the FA icon to every heading */
    $(all).prepend("<i />").css("cursor", "pointer");
    $("i").addClass(icon, "ui-state-active");

    /* Remove the arrow from the last link TODO: hardcoded, fix */
    $(".html-block .sqs-block-content H2 i").last().removeClass(icon, "ui-state-active");

    /* Close all tabs to begin with */
    // $(IMG).slideUp();
    // $(H1).nextUntil("H1").slideUp();
    // $(H2).nextUntil("H2, H1").slideUp();
    // $(H3).nextUntil("H3, H2, H1").slideUp();
    // $(H4).nextUntil("H4, H3, H2, H1").slideUp();
    // $(H3).each(closeH3);
    // $(H4).each(closeH4);
    // var b = $(IMG).parentsUntil(".sqs-block").parent().next().children().children().first();
    // b.slideToggle();
    // b.nextUntil("H4, H3, H2, H1").slideToggle();

    //Open H3 subheadings as well
    // $(H3).slideDown();

    /* Toggle state of clicked H2 */
    $(H2).click(function () {
        $(this).nextUntil("H4, H3, H2, H1").slideToggle();
        $(this).toggleClass("ui-state-active");
    });

    /* Toggle state of clicked H3 */
    $(H3).click(function () {
        $(this).nextUntil("H4, H3, H2, H1").slideToggle();
        $(this).toggleClass("ui-state-active");

        //Toggle appearance of H4
        $(this).nextUntil("H3").next("H4").slideToggle();
    });

    $(H3).click(closeH3);
    $(H4).click(toggle);

});
