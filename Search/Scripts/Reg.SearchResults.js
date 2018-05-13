function setFormValues(columnName, sortDirection, startAt, itemLimit) {
    $('input[name="sort_column"]').val(columnName);
    $('input[name="sort_direction"]').val(sortDirection);
    $('input[name="startAt"]').val(startAt);
    $('input[name="itemLimit"]').val(itemLimit);
}

function setArrow(columnName, sortDirection) {
    var arrow;
    if (sortDirection == "ASC") {
        arrow = "&#160;&#9650;" //Space and ▲
    }
    else {
        arrow = "&#160;&#9660;" //Space and ▼
    }
    $("#arrow_" + columnName).html(arrow);
}

$(document).ready(function () {
    // Get state of current sort values
    var currentSortColumn = $('input[name="sort_column"]').val();
    var currentSortDirection = $('input[name="sort_direction"]').val();
    var currentStartAt = $('input[name="startAt"]').val();
    var currentItemLimit = $('input[name="itemLimit"]').val();

    // Set the Arrow direction
    setArrow(currentSortColumn, currentSortDirection);

    $(".sortable").click(function () {
        var colName = $(this).data("colname");
        var currentSortColumn = $('input[name="sort_column"]').val();
        var currentSortDirection = $('input[name="sort_direction"]').val();
        var currentStartAt = $('input[name="startAt"]').val();
        var currentItemLimit = $('input[name="itemLimit"]').val();
        var sortDirection = currentSortDirection;

        // Check if re-clicking the same sort column
        if (colName == currentSortColumn) {
            if (currentSortDirection == "ASC") {
                sortDirection = "DESC";
            }
            else {
                sortDirection = "ASC";
            }
        }
        else {
            sortDirection = "ASC"; // Default when newly clicked.
        }
        // Since sorting, reset the page to 1
        setFormValues(colName, sortDirection, 1, currentItemLimit);

        setArrow(colName, sortDirection);
        __doPostBack('sort_column', '');
        //window.waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose('Loading', 'Loading the content, please wait', 90, 275);
        return false;
    });

    $(".itemMenu").click(function () {
        var propertiesURL = $(this).data("properties");
        var itemURL = $(this).data("url");
        var editURL = $(this).data("edit");
        var webURL = $(this).data("weburl");
        var position = $(this).position();
        var offset = $(this).offset();

        // Clear out current items
        $("#custom-context-menu").html("");

        var mailToLink = 'mailto:?subject=Imaging Document&amp;body=This document can be viewed at this location:%0a%0a' + itemURL.replace(/ /g, '%2520');

        // Add items to context menu
        $("#custom-context-menu").append('<li><a class="contextItem" href="' + itemURL + '">View Document</a></li>');
        $("#custom-context-menu").append('<li><a class="contextItem searchResultsEditItem" href="#">Edit Document</a></li>').find('.searchResultsEditItem').click(function() {
            editDocumentWithProgID2(itemURL, '', 'SharePoint.OpenDocuments', '0', webURL, '0');
            return false;
        });
        $("#custom-context-menu").append('<li><a class="contextItem" onclick="ShowPopupDialog(GetGotoLinkUrl(this));return false;" href="' + propertiesURL + '">View Properties</a></li>');
        $("#custom-context-menu").append('<li><a class="contextItem" href="' + mailToLink + '">Mail Link to Document</a></li>');

        // Show context menu
        $("#custom-context-menu").toggle(200).css({
            top: position.top - $(this).height(),
            left: position.left
        });
        return false;
    });

    // Hide once a context menu item is clicked.
    $("#custom-context-menu").on("click", "a.contextItem", function () {
        $("#custom-context-menu").hide(100);
    });

    // If the document is clicked somewhere
    $(document).bind("mousedown", function (e) {
        // If the clicked element is not the menu
        if (!$(e.target).parents("#custom-context-menu").length > 0) {

            // Hide it
            $("#custom-context-menu").hide(100);
        }
    });

    // Set form values before navigating by page.
    $("a.paging").click(function (event) {
        event.preventDefault();

        var direction = $(this).data("direction");
        var currentStartAt = parseInt($('input[name="startAt"]').val());
        var currentItemLimit = parseInt($('input[name="itemLimit"]').val());
        var nextStartAt;

        if (direction == "forward") {
            nextStartAt = currentStartAt + currentItemLimit;
        }
        else {
            nextStartAt = currentStartAt - currentItemLimit;
        }

        // Change value of startAt
        $('input[name="startAt"]').val("");
        $('input[name="startAt"]').val(nextStartAt);

        __doPostBack('sort_column', '');
    });

    $("#btnJumpTo").click(function (event) {
        var direction = $(this).data("direction");
        var currentStartAt = parseInt($('input[name="startAt"]').val());
        var currentItemLimit = parseInt($('input[name="itemLimit"]').val());
        var pageNumberJump = parseInt($('input[name="pageNumberJump"]').val());

        // Set new StartAt
        var newStartAt = (pageNumberJump * currentItemLimit) - currentItemLimit + 1;
        $('input[name="startAt"]').val(newStartAt);
        __doPostBack('sort_column', '');
    });

    // Do postback if enter key on Jump To input
    $('input[name="pageNumberJump"]').keypress(function (e) {
        if (e.which == 13) {
            $("#btnJumpTo").click();
            return false;
        }
    });

});