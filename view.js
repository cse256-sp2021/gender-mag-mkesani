// ---- Define your dialogs  and panels here ----

//calliing define_new_effective_permissions function and storing the result in a variable (Effective Permissions Panel step 1/2)
newPanel = define_new_effective_permissions('panel1', add_info_col = true, which_permissions = null);

$('#sidepanel').append(newPanel);

//Effective Permissions Panel step 3/4 
newUserSelect = define_new_user_select_field('panel1', 'Select A User To View Their Permissions', on_user_change = function(selected_user){
    $('#panel1').attr('username', selected_user)
});

$('#sidepanel').append(newUserSelect);

/*var which_file = document.createElement("INPUT");
var which_file_text = document.createElement("p");
which_file.setAttribute("type", "text");
which_file.setAttribute("value", "");
which_file.setAttribute("id", "file_input");
which_file_text.setAttribute("id", "file_input_text");

$('#sidepanel').append(which_file_text);
$('#sidepanel').append(which_file);
document.getElementById("file_input").style.height = "30px";
document.getElementById("file_input").style.width = "400px";
document.getElementById("file_input").style.marginTop = "400px";
document.getElementById("file_input_text").style.innerHTML = "Please choose one of the following filepaths for which you would like to view permissions and copy and paste the path into the input field ";
*/

/*
var which_file_form = document.createElement("form");
which_file_form.setAttribute("id", "file_input_form");
//document.getElementById("file_input_form").style.width = "40px";
$('#sidepanel').append(which_file_form);



var which_file_select = document.createElement("select");
which_file_select.setAttribute("id", "file_input_select");
$('#file_input_form').append(which_file_select);


var option1 = document.createElement("option");
option1.setAttribute("value", "apple");
//option1.setAttribute("id", "option1");
//document.getElementById("option1").innerHTML = "Apple";
$('#file_input_select').appendChild(option1);
*/

/*
var option2 = document.createElement("option");
option2.setAttribute("value", "banana");
$('#file_input_select').append(option2);

var option3 = document.createElement("option");
option3.setAttribute("value", "orange");
$('#file_input_select').append(option3);
*/

/*
<form>
  Select your favorite fruit:
  <select id="file_select">
    <option value="apple">Apple</option>
    <option value="orange">Orange</option>
    <option value="pineapple">Pineapple</option>
    <option value="banana">Banana</option>
  </select>
</form>
*/

//document.getElementById("file_select").value

//$('#panel1').attr('filepath', document.getElementById("mySelect").value);



$('#panel1').attr('filepath', '/C/presentation_documents/important_file.txt');

//Permissions Explanation step 1

dialog1 = define_new_dialog('panel1', title='Permissions Info');

//Permissions Explanation step 2-4
$('.perm_info').click(function(){
    dialog1.dialog('open');
    //console.log($('#panel1').attr('filepath'));
    //console.log($('#panel1').attr('username'));
    //console.log($(this).attr('permission_name'));
    //file = path_to_file[$('#panel1').attr('filepath')];
    //user = all_users[$('#panel1').attr('username')];
    explain1 = allow_user_action(path_to_file[$('#panel1').attr('filepath')], all_users[$('#panel1').attr('username')], $(this).attr('permission_name'), explain_why = true);
    dialog1.html(get_explanation_text(explain1));
})


//npm run serve

// ---- Display file structure ----

// (recursively) makes and returns an html element (wrapped in a jquery object) for a given file object
function make_file_element(file_obj) {
    let file_hash = get_full_path(file_obj)

    if(file_obj.is_folder) {
        let folder_elem = $(`<div class='folder' id="${file_hash}_div">
            <h3 id="${file_hash}_header">
                <span class="oi oi-folder" id="${file_hash}_icon"/> ${file_obj.filename} 
                <button class="ui-button ui-widget ui-corner-all permbutton" path="${file_hash}" id="${file_hash}_permbutton"> 
                    <span class="oi oi-lock-unlocked" id="${file_hash}_permicon"/> 
                </button>
            </h3>
        </div>`)

        // append children, if any:
        if( file_hash in parent_to_children) {
            let container_elem = $("<div class='folder_contents'></div>")
            folder_elem.append(container_elem)
            for(child_file of parent_to_children[file_hash]) {
                let child_elem = make_file_element(child_file)
                container_elem.append(child_elem)
            }
        }
        return folder_elem
    }
    else {
        return $(`<div class='file'  id="${file_hash}_div">
            <span class="oi oi-file" id="${file_hash}_icon"/> ${file_obj.filename}
            <button class="ui-button ui-widget ui-corner-all permbutton" path="${file_hash}" id="${file_hash}_permbutton"> 
                <span class="oi oi-lock-unlocked" id="${file_hash}_permicon"/> 
            </button>
        </div>`)
    }
}

for(let root_file of root_files) {
    let file_elem = make_file_element(root_file)
    $( "#filestructure" ).append( file_elem);    
}



// make folder hierarchy into an accordion structure
$('.folder').accordion({
    collapsible: true,
    heightStyle: 'content'
}) // TODO: start collapsed and check whether read permission exists before expanding?


// -- Connect File Structure lock buttons to the permission dialog --

// open permissions dialog when a permission button is clicked
$('.permbutton').click( function( e ) {
    // Set the path and open dialog:
    let path = e.currentTarget.getAttribute('path');
    perm_dialog.attr('filepath', path)
    perm_dialog.dialog('open')
    //open_permissions_dialog(path)

    // Deal with the fact that folders try to collapse/expand when you click on their permissions button:
    e.stopPropagation() // don't propagate button click to element underneath it (e.g. folder accordion)
    // Emit a click for logging purposes:
    emitter.dispatchEvent(new CustomEvent('userEvent', { detail: new ClickEntry(ActionEnum.CLICK, (e.clientX + window.pageXOffset), (e.clientY + window.pageYOffset), e.target.id,new Date().getTime()) }))
});


// ---- Assign unique ids to everything that doesn't have an ID ----
$('#html-loc').find('*').uniqueId() 

