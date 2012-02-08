function Test() { };
OModule.inheritance(Test);

Test.sectionTypes={
    RCode:1,
    loadTemplate:2,
    goTo:3,
    ifStatement:4,
    setVariable:5,
    start:6,
    end:7,
    tableModification:8,
    custom:9
};

Test.className="Test";

Test.onAfterEdit=function()
{
    if(Test.currentID==0) Test.resetCounter();
};

Test.onAfterSave=function()
{
    };

Test.getAddSaveObject=function()
{
    return { 
        oid:this.currentID,
        class_name:this.className,
        name:$("#form"+this.className+"InputName").val(),
        Sharing_id:$("#form"+this.className+"SelectSharing").val()
    };
};

Test.getFullSaveObject = function() {
    var obj = this.getAddSaveObject();
    obj["sections"] = Test.getSerializedSections();
    if($("#form"+this.className+"SelectOwner").length==1) obj["Owner_id"]=$("#form"+this.className+"SelectOwner").val();
    return obj;
}

Test.sectionCounter = 0;
Test.getCounter=function(){
    Test.sectionCounter++;
    return Test.sectionCounter;
}

Test.resetCounter=function(){
    Test.sectionCounter = 0;
}

Test.setCounter=function(value){
    Test.sectionCounter = value;
}

Test.getSectionValues=function(section){
    switch(section.type){
        case Test.sectionTypes.RCode:{
            return [$(".divSection[seccounter="+section.counter+"] #textareaCodeMirror_"+section.counter).val()];
        }
        case Test.sectionTypes.goTo:{
            return [$(".divSection[seccounter="+section.counter+"] select").val()];
        }
        case Test.sectionTypes.ifStatement:{
            var values = new Array();
            $(".divSection[seccounter="+section.counter+"] .controlValue"+section.counter).each(function(){
                values.push($(this).val());
            });
            return values;
        }
        case Test.sectionTypes.loadTemplate:{
            var values = [
            $(".divSection[seccounter="+section.counter+"] #selectTemplate_"+section.counter).val(),
            $(".divSection[seccounter="+section.counter+"] .controlValue"+section.counter+"_params").length,
            $(".divSection[seccounter="+section.counter+"] .controlValue"+section.counter+"_rets").length/3,
            ];
            $(".divSection[seccounter="+section.counter+"] .controlValue"+section.counter+"_params").each(function(){
                values.push($(this).val());
            });
            $(".divSection[seccounter="+section.counter+"] .controlValue"+section.counter+"_rets").each(function(){
                values.push($(this).val());
            });
            return values;
        }
        case Test.sectionTypes.setVariable:{
            var values = [
            $(".divSection[seccounter="+section.counter+"] .controlValue"+section.counter+"_column").length-1,
            $(".divSection[seccounter="+section.counter+"] .controlValue"+section.counter+"_link").length,
            $(".divSection[seccounter="+section.counter+"] .radioSetVarType_"+section.counter+":checked").val(),
            $(".divSection[seccounter="+section.counter+"] #textareaCodeMirror_"+section.counter).val(),
            $(".divSection[seccounter="+section.counter+"] .controlValue"+section.counter+"_visibility").val(),
            $(".divSection[seccounter="+section.counter+"] .controlValue"+section.counter+"_type").val()
            ];
            $(".divSection[seccounter="+section.counter+"] .controlValue"+section.counter).each(function(){
                values.push($(this).val());
            });
            return values;
        }
        case Test.sectionTypes.tableModification:{
            var values = [
            $(".divSection[seccounter="+section.counter+"] .radioTableModType_"+section.counter+":checked").val(), //type
            $(".divSection[seccounter="+section.counter+"] .controlValue"+section.counter+"_link").length, //where count
            $(".divSection[seccounter="+section.counter+"] .controlValue"+section.counter+"_set").length //set count
            ];
            $(".divSection[seccounter="+section.counter+"] .controlValue"+section.counter).each(function(){
                values.push($(this).val());
            });
            return values;
        }
        case Test.sectionTypes.custom:{
            values=new Array();
            $(".divSection[seccounter="+section.counter+"] .controlValue"+section.counter).each(function(){
                values.push($(this).val());
            });
            return values;
        }
        default:{
            return [];
        }
    }
}

Test.getSerializedSections=function(){
    var s = Test.getSections();
    var result = new Array();
    s.each(function(){
        var section = Test.sectionDivToObject($(this));
        var values = Test.getSectionValues(section);
        var v = {};
        for(var i=0;i<values.length;i++){
            v["v"+i]=values[i];
        }
        section["value"]=$.toJSON(v);
        result.push(section);
    });
    return result;
}

Test.getSectionTypeDescription=function(type){
    switch(type){
        case Test.sectionTypes.RCode:{
            return dictionary["s40"];
        }
        case Test.sectionTypes.loadTemplate:{
            return dictionary["s41"];
        }
        case Test.sectionTypes.goTo:{
            return dictionary["s42"];
        }
        case Test.sectionTypes.ifStatement:{
            return dictionary["s43"];
        }
        case Test.sectionTypes.setVariable:{
            return dictionary["s44"];
        }
        case Test.sectionTypes.start:{
            return dictionary["s45"];
        }
        case Test.sectionTypes.end:{
            return dictionary["s46"];
        }
        case Test.sectionTypes.tableModification:{
            return dictionary["s47"];
        }
        case Test.sectionTypes.custom:{
            return dictionary["s48"];
        }
    }
}

Test.getSectionTypeName=function(type){
    switch(type){
        case Test.sectionTypes.RCode:{
            return dictionary["s49"];
        }
        case Test.sectionTypes.loadTemplate:{
            return dictionary["s50"];
        }
        
        case Test.sectionTypes.goTo:{
            return dictionary["s51"];
        }
        case Test.sectionTypes.ifStatement:{
            return dictionary["s52"];
        }
        case Test.sectionTypes.setVariable:{
            return dictionary["s53"];
        }
        case Test.sectionTypes.start:{
            return dictionary["s54"];
        }
        case Test.sectionTypes.end:{
            return dictionary["s55"];
        }
        case Test.sectionTypes.tableModification:{
            return dictionary["s56"];
        }
        case Test.sectionTypes.custom:{
            return dictionary["s57"];
        }
    }
}

Test.contentsToRefresh=0;
Test.uiRefreshSectionContent=function(type,counter,value,oid){
    Test.contentsToRefresh++;
    if(oid==null) oid=0;
    switch(type){
        case Test.sectionTypes.RCode:{
            if(value==null) value =[""];
            break;
        }
        case Test.sectionTypes.goTo:
        case Test.sectionTypes.loadTemplate:{
            if(value==null) value=[0,0,0];
            break;
        }
        case Test.sectionTypes.ifStatement:{
            if(value==null) value=["",0,""];
            break;
        }
        case Test.sectionTypes.setVariable:{
            if(value==null) value=[0,0,0,"",2,0,"",0,0];
            break;
        }
        case Test.sectionTypes.tableModification:{
            if(value==null) value=[0,0,0];
            break;
        }
        case Test.sectionTypes.custom:{
            if(value==null) value = [0];
            break;
        }
    }
    $.post("view/section_content_"+type+".php",{
        type:type,
        counter:counter,
        value:value,
        oid:oid
    },function(data){
        $("#divSection_"+counter+"_content").html(data);
        switch(type){
            case Test.sectionTypes.RCode:{
                var cm = Methods.iniCodeMirror("textareaCodeMirror_"+counter, "r", false);
                Test.codeMirrors.push(cm);
                break;
            }
            case Test.sectionTypes.setVariable:{
                var cm = Methods.iniCodeMirror("textareaCodeMirror_"+counter, "r", false);
                Test.codeMirrors.push(cm);
                break;
            }
            case Test.sectionTypes.goTo:{
                var sections = Test.getSections();
                $("#selectGoTo_"+counter).append("<option value='0'>&lt;"+dictionary["s58"]+"&gt;</option>");
                sections.each(function(){
                    var s = Test.sectionDivToObject($(this));
                    if(s.counter==counter) return;
                    $("#selectGoTo_"+counter).append("<option value='"+s.counter+"' "+(value[0]==s.counter?"selected":"")+">"+s.counter+": "+Test.getSectionTypeName(s.type)+"</option>");
                });
                break;
            }
        }
        Methods.iniIconButton(".btnAddLogicSection", "plus");
        Test.contentsToRefresh--;
        if(Test.contentsToRefresh==0) Test.uiSetVarNameChanged();
        Methods.iniTooltips();
    });
};

Test.uiWriteSection=function(type,container,parent,counter,value,oid,append,refresh,csid){
    if(refresh==null) refresh=true;
    if(parent==null) parent = 0;
    if(counter==null) counter = Test.getCounter();
    if(append==null) append=false;
    if(csid==null) csid = 0;
    if(csid!=0 && value==null) value=[csid];
    var sortable = true;
    if(type==Test.sectionTypes.start||type==Test.sectionTypes.end || parent!=0) sortable = false;
    var mainContainer = $("#divTestLogic");
    var section = $("<div />",{
        "class": ""+(type==Test.sectionTypes.ifStatement?"ui-corner-all":"")+" margin divSection divSectionType"+type+" ui-state-default "+(!sortable?"notSortable":"sortable"),
        id:"divSection_"+counter,
        csid:csid,
        sectype:type,
        seccounter:counter,
        secparent:parent,
        onmouseover:"Methods.uiToggleHover($(this),true)",
        onmouseout:"Methods.uiToggleHover($(this),false)",
        style:"border:"+(type==Test.sectionTypes.ifStatement?"dotted":"double")+"; z-index:20;"
    });
    
    var spanDelete = '';
    var spanAddAfter = '';
    var divControl = '';
    var divSubSection = '';
    if(type==Test.sectionTypes.ifStatement) divSubSection = '<div id="divSectionSubContent_'+counter+'" class="divSubsection"></div>';
    if(type!=Test.sectionTypes.start && type!=Test.sectionTypes.end) spanDelete = '<span class="spanIcon tooltip ui-icon ui-icon-trash" onclick="Test.uiRemoveSection(\''+counter+'\')" title="'+dictionary["s59"]+'"></span>';
    if(type!=Test.sectionTypes.end) spanAddAfter = '<span class="spanIcon tooltip ui-icon ui-icon-plus" onclick="Test.uiAddLogicSession($(this).parent().parent().parent().parent().parent().parent(),'+(parent!=0?"true":"null")+','+parent+')" title="'+dictionary["s60"]+'"></span>';
    if(spanDelete!='' || spanAddAfter!='') divControl = '<div><table><tbody><tr><td>'+spanAddAfter+'</td><td>'+spanDelete+'</td></tbody></table></div>';
    
    var html='<div class="ui-widget-header margin sortableHandle" '+(sortable?'style="cursor:move;"':'')+'><table><tr><td><span class="spanIcon ui-icon ui-icon-help tooltip" title="'+Test.getSectionTypeDescription(type)+'"></span></td><td>'+counter+'. '+Test.getSectionTypeName(type)+'</td></tr></table></div>';
    html+='<div class="horizontalMargin" id="divSection_'+counter+'_content" align="left"></div>'+divSubSection;
    html+=divControl;
        
    section.html(html);
        
    if(container==null) 
    {
        if(append) mainContainer.append(section);
        else mainContainer.prepend(section);
    }
    else 
    {
        if(!append) container.after(section);
        else container.append(section);
    }
    
    if(refresh) Test.uiRefreshSectionContent(type,counter,value,oid);
    
    Test.uiCheckEmptyLogic();
        
    Test.uiSectionChanged();
    Methods.iniTooltips();
    
};

Test.uiAddLogicSession=function(container,ifstatement,parent){
    var type = $("#formTestSelectSectionType");
    
    if(ifstatement==null) ifstatement=false;
    
    if(ifstatement){
        if(parseInt(type.val())==Test.sectionTypes.ifStatement) type.val(1);
        $("#optionSectionType"+Test.sectionTypes.ifStatement).attr("disabled","disabled");
    }
    else 
    {
        $("#optionSectionType"+Test.sectionTypes.ifStatement).removeAttr("disabled");
    }
    
    $("#divTestDialog").dialog( {
        modal:true,
        title:dictionary["s61"],
        resizable:false,
        buttons:[
        {
            text:dictionary["s23"],
            click:function(){
                $(this).dialog("close");
            }
        },
        {
            text:dictionary["s37"],
            click:function(){
                var vls = type.val().split(":");
                var t = 0;
                var csid = 0;
                if(vls.length>1) {
                    t = parseInt(vls[0]);
                    csid = vls[1];
                }
                else t = parseInt(vls);
                
                Test.uiWriteSection(t,container,parent,null,null,null,null,null,csid);
                $(this).dialog("close");
            }
        }
        ]
    });
};

Test.uiRemoveSection=function(counter){
    Methods.confirm(dictionary["s62"], dictionary["s63"], function(){
        $("#divSection_"+counter).remove();
        Test.uiSectionChanged();
        Test.uiCheckEmptyLogic();
        Test.uiSetVarNameChanged();
    })
}

Test.getSections=function(){
    return $("#divTestLogic .divSection");
}

Test.uiCheckEmptyLogic=function(){
    if(Test.getSections().length>2) 
    {
        $("#divTestEmptyLogic").hide(0);
    }
    else $("#divTestEmptyLogic").show(0);
};

Test.sectionDivToObject=function(div){
    var counter = parseInt(div.attr("seccounter"));
    var type = parseInt(div.attr("sectype"));
    var parent = parseInt(div.attr("secparent"));
    return {
        counter:counter,
        type:type,
        parent:parent
    };
}

Test.uiTemplatesChanged=function(){
    var sections = Test.getSections();
    sections.each(function(){
        var s = Test.sectionDivToObject($(this));
        if(s.type==Test.sectionTypes.loadTemplate){
            var vals = Test.getSectionValues(s);
            Test.uiRefreshSectionContent(s.type, s.counter, [vals[0],vals[1],vals[2]]);
        }
    });
}

Test.uiCustomSectionsChanged=function(){
    var sections = Test.getSections();
    sections.each(function(){
        var s = Test.sectionDivToObject($(this));
        if(s.type==Test.sectionTypes.custom){
            var value = Test.getSectionValues(Test.sectionDivToObject($('#divSection_'+s.counter)));
            Test.uiRefreshSectionContent(s.type, s.counter, value);
        }
    });
    Test.uiRefreshAddSectionDialog();
}

Test.uiRefreshAddSectionDialog=function(){
    $.post("view/Test_section_dialog.php",{},function(data){
        $("#divTestDialog").html(data);
    })
}

Test.listenToSectionChanged=true;
Test.uiSectionChanged=function(){
    if(!Test.listenToSectionChanged) return;
    var sections = Test.getSections();
    sections.each(function(){
        var s = Test.sectionDivToObject($(this));
        if(s.type==Test.sectionTypes.goTo){
            var value = $(this).find("select").val();
            Test.uiRefreshSectionContent(s.type, s.counter, [value]);
        }
    });
}

Test.uiAddTableModSet=function(counter){
    var vals = Test.getSectionValues(Test.sectionDivToObject($('#divSection_'+counter)));
    vals[2]++;
    vals.splice(vals[2]*2+4, 0, 0);
    vals.splice(vals[2]*2+4, 0, "");
    Test.uiRefreshSectionContent(Test.sectionTypes.tableModification,counter,vals);
}

Test.uiRemoveTableModSet=function(counter){
    var vals = Test.getSectionValues(Test.sectionDivToObject($('#divSection_'+counter)));
    vals[2]--;
    vals.splice(vals[2]*2+4, 2);
    Test.uiRefreshSectionContent(Test.sectionTypes.tableModification,counter,vals);
}

Test.uiAddTableModWhere=function(counter){
    var vals = Test.getSectionValues(Test.sectionDivToObject($('#divSection_'+counter)));
    vals[1]++;
    Test.uiRefreshSectionContent(Test.sectionTypes.tableModification,counter,vals);
}

Test.uiRemoveTableModWhere=function(counter){
    var vals = Test.getSectionValues(Test.sectionDivToObject($('#divSection_'+counter)));
    vals[1]--;
    Test.uiRefreshSectionContent(Test.sectionTypes.tableModification,counter,vals);
}

Test.uiAddIfCond=function(counter){
    var vals = Test.getSectionValues(Test.sectionDivToObject($('#divSection_'+counter)));
    vals = vals.concat([0,"","!=",""]);
    Test.uiRefreshSectionContent(Test.sectionTypes.ifStatement,counter,vals);
}

Test.uiRemoveIfCond=function(counter){
    var vals = Test.getSectionValues(Test.sectionDivToObject($('#divSection_'+counter)));
    vals.splice(vals.length-4, 4);
    Test.uiRefreshSectionContent(Test.sectionTypes.ifStatement,counter,vals);
}

Test.uiAddSetVarColumn=function(counter){
    var vals = Test.getSectionValues(Test.sectionDivToObject($('#divSection_'+counter)));
    vals[0]++;
    vals.splice(vals[0]+8, 0, 0);
    Test.uiRefreshSectionContent(Test.sectionTypes.setVariable,counter,vals);
}
Test.uiRemoveSetVarColumn=function(counter){
    var vals = Test.getSectionValues(Test.sectionDivToObject($('#divSection_'+counter)));
    vals.splice(vals[0]+8, 1);
    vals[0]--;
    Test.uiRefreshSectionContent(Test.sectionTypes.setVariable,counter,vals);
}

Test.uiAddSetVarCondition=function(counter){
    var vals = Test.getSectionValues(Test.sectionDivToObject($('#divSection_'+counter)));
    vals[1]++;
    Test.uiRefreshSectionContent(Test.sectionTypes.setVariable,counter,vals);
}

Test.uiRemoveSetVarCondition=function(counter){
    var vals = Test.getSectionValues(Test.sectionDivToObject($('#divSection_'+counter)));
    vals[1]--;
    Test.uiRefreshSectionContent(Test.sectionTypes.setVariable,counter,vals);
}

Test.uiTablesChanged=function(){
    var sections = Test.getSections();
    sections.each(function(){
        var s = Test.sectionDivToObject($(this));
        if(s.type==Test.sectionTypes.setVariable){
            var value = Test.getSectionValues(Test.sectionDivToObject($('#divSection_'+s.counter)));
            Test.uiRefreshSectionContent(s.type, s.counter, value);
        }
    });
}

Test.variableValidation=function(value){
    var oldValue = value;
    var newValue = Test.convertVariable(oldValue);
    if(oldValue!=newValue) return false;
    else return true;
}

Test.convertVariable=function(value){
    value = value.replace(/[^A-Z^a-z^0-9._]/gi,"")
    value = value.replace(/^[0-9]*/,"");
    return value;
}

Test.uiSetVarNameChanged=function(obj){
    if(obj!=null){
        var oldValue = obj.val();
        if(!Test.variableValidation(oldValue)){
            var newValue = Test.convertVariable(oldValue);
            obj.val(newValue);
            Methods.alert(dictionary["s1"].format(oldValue,newValue), "info", "variable validation");
        }
    }
    
    Test.uiRefreshComboBoxes();
    
    var vars = Test.getSerializedLogicVars();
    
    $.post("view/Test_vars.php",{
        vars:vars
    },function(data){
        $("#divTestVarsDialog").html(data);
    });
}

Test.getLogicVars=function(){
    var vars = new Array();
    
    var svars = Test.getSetVars();
    vars = svars;
    
    var rvars = Test.getReturnVars();
    for(var i=0;i<rvars.length;i++){
        var exists = false;
        for(var a=0;a<vars.length;a++){
            if(rvars[i].name==vars[a].name){
                vars[a].section = vars[a].section.concat(rvars[i].section);
                vars[a].type = vars[a].type.concat(rvars[i].type);
                exists = true;
                break;
            }
        }
        if(!exists){
            vars.push(rvars[i]);
        }
    };
    
    var pvars = Test.getParameterVars();
    for(var i=0;i<pvars.length;i++){
        var exists = false;
        for(var a=0;a<vars.length;a++){
            if(pvars[i].name==vars[a].name){
                vars[a].section = vars[a].section.concat(pvars[i].section);
                vars[a].type = vars[a].type.concat(pvars[i].type);
                exists = true;
                break;
            }
        }
        if(!exists){
            vars.push(pvars[i]);
        }
    };
    
    vars.sort(Test.comparerVars);
    return vars;
};

Test.getSerializedLogicVars=function(){
    var vars = Test.getLogicVars();
    var result = new Array();
    for(var i=0;i<vars.length;i++) {
        for(var a=0;a<vars[i].section.length;a++){
            vars[i].section[a]["name"] = Test.getSectionTypeName(vars[i].section[a].type);
        }
        result.push($.toJSON(vars[i]));
    }
    return result;
}

Test.getReturnVars=function(){
    var vars = new Array();
    $(".inputReturnVar").each(function(){
        var v = {
            name:$(this).val(),
            section:[Test.sectionDivToObject($(this).parent().parent().parent().parent())],
            type:["return"]
        };
        var exists = false;
        for(var i=0;i<vars.length;i++){
            if(v.name==vars[i].name){
                vars[i].section = vars[i].section.concat(v.section);
                vars[i].type = vars[i].type.concat(v.type);
                exists = true;
                break;
            }
        }
        if(!exists){
            vars.push(v);
        }
    });
    return vars;
};

Test.getParameterVars=function(){
    var vars = new Array();
    $(".inputParameterVar").each(function(){
        var v = {
            name:$(this).val(),
            section:[Test.sectionDivToObject($(this).parent().parent().parent().parent())],
            type:["parameter"]
        };
        var exists = false;
        for(var i=0;i<vars.length;i++){
            if(v.name==vars[i].name){
                vars[i].section = vars[i].section.concat(v.section);
                vars[i].type = vars[i].type.concat(v.type);
                exists = true;
                break;
            }
        }
        if(!exists){
            vars.push(v);
        }
    });
    return vars;
};

Test.getSetVars=function(){
    var vars = new Array();
    var sections = Test.getSections();
    sections.each(function(){
        var s = Test.sectionDivToObject($(this));
        if(s.type==Test.sectionTypes.setVariable){
            var value = Test.getSectionValues(Test.sectionDivToObject($('#divSection_'+s.counter)));
            if(value[6]!="") {
                var v = {
                    name:value[6],
                    section:[s],
                    type:["return"]
                };
                var exists = false;
                for(var i=0;i<vars.length;i++){
                    if(v.name==vars[i].name){
                        vars[i].section = vars[i].section.concat(v.section);
                        vars[i].type = vars[i].type.concat(v.type);
                        exists = true;
                        break;
                    }
                }
                if(!exists){
                    vars.push(v);
                }
            }
        }
    });
    return vars;
}

Test.uiRefreshComboBoxes=function(){
    var sections = Test.getSections();
    var vars = [];
    var vs = Test.getLogicVars();
    for(var i=0;i<vs.length;i++){
        vars.push(vs[i].name);
    }
    sections.each(function(){
        var s = Test.sectionDivToObject($(this));
        $(this).find(".comboboxVars").each(function(){
            var val = $(this).val();
            var source = vars;
            $(this).autocomplete({
                source: source,
                minLength:0
            }).click(function(){
                $(this).autocomplete("search",'');
            });
            $(this).val(val);
        });
    });
}

Test.changeSetVarType=function(counter){
    Test.uiRefreshSectionContent(Test.sectionTypes.setVariable, counter, Test.getSectionValues(Test.sectionDivToObject($('#divSection_'+counter))));
};

Test.uiRefreshSection=function(counter,type){
    Test.uiRefreshSectionContent(type, counter, Test.getSectionValues(Test.sectionDivToObject($('#divSection_'+counter))));
}

Test.uiShowVarsDialog=function(){
    $("#divTestVarsDialog").dialog({
        show:"slide",
        hide:"slide",
        title:dictionary["s65"],
        width:600,
        close:function(){
            $(this).dialog("destroy");
        },
        buttons:[
        {
            text:dictionary["s64"],
            click:function(){
                $(this).dialog("close");
            }
        }
        ]
    });
};

Test.comparerVars=function(a,b){
    if(a==null || b==null) return 0;
    if(a!=null && !a.name) return 0;
    if(b!=null && !b.name) return 0;
    if (a.name.toString() < b.name.toString()) return -1;
    if (a.name.toString() > b.name.toString()) return 1;
    return 0;
}

Test.codeMirrors = new Array();
Test.uiRefreshCodeMirrors=function(){
    for(var i=0;i<Test.codeMirrors.length;i++){
        try{
            Test.codeMirrors[i].refresh();
        }
        catch(err){
            
        }
    }
}

Test.uiRefreshDebugCodeMirrors=function(){
    for(var i=0;i<Test.debugCodeMirrors.length;i++){
        try{
            Test.debugCodeMirrors[i].refresh();
        }
        catch(err){
            
        }
    }
}

Test.uiIniDebug=function(){
    $("#divTestDebugDialog").dialog({
        title:dictionary["s284"],
        width:800,
        height:600,
        resizeStop:function(){
            $("#divTestDebugAccordion").accordion("resize");
        },
        open:function(){
            Test.resetDebug();
            $("#divTestDebugAccordion").accordion({
                fillSpace:true,
                change:function(event,ui){
                    Test.uiRefreshDebugCodeMirrors();
                }
            });
        },
        buttons:[
        {
            text:"start",
            click:function(){
                Test.startDebug();
                $("#divTestDebugDialog").dialog("option","buttons",[
                {
                    text:"restart",
                    click:function(){
                        Test.restartDebug();
                    }
                }
                ]);
            }
        }
        ]
    });
};

Test.setDebugStatus=function(data,error){
    if(error!=null && error){
        $("#pTestDebugStatus").addClass("ui-state-error");
    } else {
        $("#pTestDebugStatus").removeClass("ui-state-error");
    }
    $("#pTestDebugStatus").html(data);
}

Test.appendDebugConsole=function(data,style){
    if(style==null) style="";
    $("#divTestDebugConsole").prepend("<p class='"+style+"'>"+data+"</p>");
}

Test.resetDebug=function(){
    Test.debugCodeMirrors=new Array();
    Test.setDebugStatus(dictionary["s285"].format(this.currentID));
    $("#divTestDebugConsole").html("");
    $("#divTestDebugTest").html("");
    Test.appendDebugConsole(dictionary["s286"].format(this.currentID), "ui-widget-header");
    Test.appendDebugConsole(dictionary["s287"], "ui-state-highlight");
    Test.appendDebugConsole(dictionary["s288"], "");
};

Test.startDebug=function(){
    Test.startSyntaxDebug();
}

Test.restartDebug=function(){
    Test.resetDebug();
    Test.startSyntaxDebug();
}

Test.debugSectionCode = {};
Test.startSyntaxDebug=function(){
    var thisClass = this;
    Test.debugSectionCode = new Array();
    
    Test.setDebugStatus(dictionary["s289"].format(this.currentID));
    Test.appendDebugConsole(dictionary["s290"], "ui-widget-header");
    $.post("query/debug_syntax_validation.php",{
        Test_id:this.currentID
    },function(data){
        var validationPassed = true;
        var counterFailed = 0;
        if(data.result==0){
            for(var k in data.data){
                var counter = k.substring(7);
                if(data.data[k]["return"]==0){
                    Test.appendDebugConsole(dictionary["s291"].format(counter));
                    Test.debugSectionCode[k] = data.data[k]["code"];
                }
                else {
                    validationPassed = false;
                    counterFailed = counter;
                    Test.appendDebugConsole(dictionary["s292"].format(counter),"ui-state-error");
                    Test.appendDebugConsole("<textarea id='textareaDebugSyntax_"+counter+"'>"+data.data[k]["code"]+"</textarea>");
                    Test.debugCodeMirrors.push(Methods.iniCodeMirror("textareaDebugSyntax_"+counter, "r", true));
                    var output = data.data[k]["output"].join("<br/>");
                    Test.appendDebugConsole(output,"ui-state-highlight");
                }
            }
            if(validationPassed){
                Test.setDebugStatus(dictionary["s293"].format(thisClass.currentID));
                Test.appendDebugConsole(dictionary["s294"]);
                Test.startRunTimeDebug();
            }
            else {
                Test.setDebugStatus(dictionary["s295"].format(thisClass.currentID,counterFailed),true);
                Test.appendDebugConsole(dictionary["s296"].format(counterFailed),"ui-state-error");
            }
        }
        if(data.result==-1){
            Methods.alert(dictionary["s278"], "alert", dictionary["s274"]);
            location.reload();  
        }
        if(data.result==-2){
            Methods.alert(dictionary["s81"], "alert", dictionary["s274"]); 
            $("#divTestDebugDialog").dialog("close");
        }
    },"json");
}

Test.runTimeResponseIndex = 0;
Test.runTimeCurrentTemplateID = 0;
Test.debugCodeMirrors = new Array();
Test.startRunTimeDebug=function(){
    var thisClass = this;
    Test.appendDebugConsole(dictionary["s297"], "ui-widget-header");
    
    Test.appendDebugConsole(dictionary["s298"].format(this.currentID));
    Test.setDebugStatus(dictionary["s299"].format(this.currentID));
    Test.appendDebugConsole(dictionary["s300"]);
    var test = new Concerto("#divTestDebugTest",null,this.currentID,"../query/",function(data){
        Test.runTimeResponseIndex++;
        Test.appendDebugConsole(dictionary["s301"]);
        
        //code
        Test.appendDebugConsole("<textarea id='textareaDebugRun_"+Test.runTimeResponseIndex+"'>"+data["result"]["code"]+"</textarea>");
        Test.debugCodeMirrors.push(Methods.iniCodeMirror("textareaDebugRun_"+Test.runTimeResponseIndex, "r", true));
        
        //output
        var output = data["result"]["output"].join("<br/>");
        Test.appendDebugConsole(output,"ui-state-highlight");
        
        //validation
        if(data["result"]["return"]!=0){
            Test.setDebugStatus(dictionary["s302"].format(thisClass.currentID,this.sessionID),true);
            Test.appendDebugConsole(dictionary["s303"],"ui-state-error");
        }
        else {
            Test.appendDebugConsole(dictionary["s304"]);
        }
        
        //HTML values
        var html = "<table><caption class='ui-widget-header'>"+dictionary["s305"]+"</caption><thead><tr><th class='ui-widget-header'>"+dictionary["s70"]+"</th><th class='ui-widget-header'>"+dictionary["s306"]+"</th></tr></thead><tbody>";
        for(var k in data["values"]){
            html+="<tr><td class='ui-widget-content'><b>"+k+"</b></td><td class='ui-widget-content'>"+data['values'][k]+"</td></tr>";
        }
        html+="</tbody></table>";
        Test.appendDebugConsole(html);
        
        //template
        if(data.control.end && data.result["return"] == 0) {
            Test.setDebugStatus(dictionary["s307"].format(thisClass.currentID,this.sessionID));
            Test.appendDebugConsole(dictionary["s308"],"ui-state-highlight");
        } else {
            if(data["result"]["return"]==0){
                Test.runTimeCurrentTemplateID = data["values"]["CURRENT_TEMPLATE_ID"];
                Test.appendDebugConsole(dictionary["s309"].format(Test.runTimeCurrentTemplateID), "ui-widget-header");
                Test.appendDebugConsole(dictionary["s310"].format(Test.runTimeCurrentTemplateID,data['values']["TIME_LIMIT"]==null || data['values']["TIME_LIMIT"]==0?dictionary["s311"]:data['values']["TIME_LIMIT"]+" "+dictionary["s312"]));
                Test.appendDebugConsole(dictionary["s313"]);
                Test.setDebugStatus(dictionary["s314"].format(thisClass.currentID,this.sessionID,Test.runTimeCurrentTemplateID));
            }
        }
    },function(btnName,vals){
        //button clicked
        if(btnName=="NONE"){
            Test.appendDebugConsole(dictionary["s315"]);
        } else {
            Test.appendDebugConsole(dictionary["s315"].format(btnName));
        }
        
        //values send
        var html = "<table><caption class='ui-widget-header'>"+dictionary["s317"]+"</caption><thead><tr><th class='ui-widget-header'>"+dictionary["s70"]+"</th><th class='ui-widget-header'>"+dictionary["s306"]+"</th><th class='ui-widget-header'>"+dictionary["s318"]+"</th><th class='ui-widget-header'>"+dictionary["s122"]+"</th></tr></thead><tbody>";
        for(var i=0;i<vals.length;i++){
            var val = jQuery.parseJSON(vals[i]);
            var visibility = "";
            var type = "";
            switch(val.visibility){
                case 0:
                    visibility = dictionary["s275"];
                    break;
                case 1:
                    visibility = dictionary["s18"];
                    break;
                case 2:
                    visibility = dictionary["s276"];
                    break;
            }
            switch(type){
                case 0:
                    type = dictionary["s280"];
                    break;
                case 1:
                    type = dictionary["s281"];
                    break;
                case 2:
                    type = dictionary["s282"];
                    break;
            }
            html+="<tr><td class='ui-widget-content'>"+val.name+"</td><td class='ui-widget-content'>"+val.value+"</td><td class='ui-widget-content'>"+visibility+"</td><td class='ui-widget-content'>"+type+"</td></tr>";
        }
        html+="</tbody></table>";
        Test.appendDebugConsole(html);
        
        Test.setDebugStatus(dictionary["s299"].format(thisClass.currentID));
    });
    test.run();
}