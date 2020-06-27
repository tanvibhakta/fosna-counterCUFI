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
 * This function takes a header and returns a list of headers that the blocks
 * need to toggle items until, sorted in decreasing order of priority
 * @param header A node
 * @param opp {boolean} A parameter that ensures the function returns the inverse of desired result
 * @returns {string} A list of headers, sorted in decreasing order of priority
 */
function constructHeaderSelector(header, opp = false) {
    //Fixme: must check if items are things other than h1, h2 , h3, h4!
    //Fixme: better variable name!!
    let b = [H4, H3, H2, H1];
    const index = b
        .map(element =>
            element.includes(header.nodeName) ?
            b.indexOf(element) :
            null)
        .filter(element => element != null)
        .slice(-1)[0]

    if (opp) {
        return b.slice(0, index).join(", ");
    }
    return b.slice(index).join(", ");
}

/**
 * Given a header, will skip through blocks, closing them, until it
 * reaches the one of the appropriate headers at which to stop
 * @param header A Node that is one of ("h1, h2, h3, h4")
 *
 */
function toggle(header) {

    // Algorithm: header
    //     - Check where the next header is
    //         - toggle all the nodes under it until header
    //         - if next header not reached, skip to the next block
    //         - keep skipping until the header is reached

    let toggleables = [];
    let headerSelector = constructHeaderSelector(header);

    if ($(header).nextAll(headerSelector).length) {
        // We have a sibling in our block that's an appropriate header
        // We just add these siblings to our toggleables list, and call it done
        toggleables = [$(header).nextUntil(headerSelector)];
    } else {
        // We don't have a sibling in our block that is an appropriate header
        // We try the next block, and keep trying until we find one

        // Add all siblings in block to toggleables list
        toggleables = [$(header).nextAll()];

        // While nextBlock doesn't have a child that matches headerSelector
        // add it to toggleables, and keep going
        let $nb = nextBlock(header);
        while (true) {
            if (!$nb.length) {
                // Avoid infinite loops when we are near end of page
                break;
            }

            // Fetch the actual div that has content
            const $nbContent = $nb.find('.sqs-block-content');

            if ($nbContent.children(headerSelector).length) {
                // We have a header in this block!
                // Let's add everything until then, and call it a day
                // FIXME: Not sure how to get 'all children until something matches' so...
                toggleables.push($nbContent.children().first());
                toggleables.push($nbContent.children().first().nextUntil(headerSelector))
                break;
            } else {
                // No header in this block, keep going
                toggleables.push($nbContent.children())
                $nb = nextBlock($nb)
            }

        }
    }

    toggleables.forEach((t) => {
        if ($(header).hasClass('ui-state-active')) {
            $(t).slideUp();
            $(t).removeClass('ui-state-active');
        } else {
            let oppHS = constructHeaderSelector(header, true);
            oppHS && $(t).siblings(oppHS).addClass('ui-state-active');
            $(t).slideDown();
        }
    });

    $(header).toggleClass("ui-state-active");
}


$(document).ready(function () {

    // Setup cursors to show over H1, H2, H3, H4
    // Appending the FA icon to every heading
    $(all).prepend("<i />").css("cursor", "pointer");
    $("i").addClass(icon, "ui-state-active");

    // Remove the arrow from the last link TODO: hardcoded, fix
    $(".html-block .sqs-block-content H2 i").last().removeClass(icon, "ui-state-active");

    $('[data-section-id="5ee2523e3dba006e9becb097"]').find('h1, h2, h3, h4, h5').click(function () {
        toggle(this)
    });

    $([H2, H4, H3].join(', ')).each(function () {
        $(this).addClass("ui-state-active");
    })
    
    $(H4).each(function () {
        toggle(this);
    })

});
