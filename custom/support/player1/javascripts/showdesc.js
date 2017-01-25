//Click show
function show(){
        document.getElementById('shortdesc').style.visibility="hidden";
        document.getElementById('shortdesc').style.display="none";
        document.getElementById('longdesc').style.display="block";
        document.getElementById('longdesc').style.visibility="visible";
        document.getElementById('showlink').innerHTML="<a style=\"cursor:pointer;\" onClick=\"hide()\">Less Info<\/a>";

}
function hide(){
        document.getElementById('shortdesc').style.visibility="visible";
        document.getElementById('shortdesc').style.display="block";
        document.getElementById('longdesc').style.display="none";
        document.getElementById('longdesc').style.visibility="hidden";
        document.getElementById('showlink').innerHTML="<a style=\"cursor:pointer;\" onClick=\"show()\">More Info<\/a> ";
        }