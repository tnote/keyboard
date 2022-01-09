let OS = { windows: "windows", mac: "mac", other: "other", userText: "text" };
var myOs = OS.mac; // default

var prefixKeys = "";
var prefixKeysHtml = "";

var isTextInputMode = false;

$("document").ready(function () {
  if (platform.os.family.indexOf("Win") != -1) {
    setCustomOS(OS.windows);
  } else if (platform.os.family.indexOf("Mac") != -1) {
    setCustomOS(OS.mac);
  } else {
    // setCustomOS(OS.other);
    setCustomOS(myOs);
  }

  // on OS selection radio button click
  $("input:radio").click((e) => {
    setCustomOS(e.currentTarget.name);
  });

  $("#user-text-input").hide();

  function setCustomOS(newOs) {
    myOs = newOs;
    $(":radio").prop("checked", false); // clear previous os selections
    $("input[name=" + myOs + "]:radio").prop("checked", true);

    if (myOs == OS.userText) {
      $("#kb-input").hide();
      $("#user-text-input").show();
      isTextInputMode = true;
    } else {
      $("#kb-input").show();
      $("#user-text-input").hide();
      isTextInputMode = false;
    }

    updateToggleButtons(myOs);
  }

  function updateToggleButtons(newOs) {
    let $metaKey = $("#meta-toggle");
    $metaKey.removeClass("cmd");
    $metaKey.removeClass("win");
    $metaKey.removeClass("meta");

    if (myOs == OS.mac) {
      $metaKey.addClass("cmd");
    } else if (myOs == OS.windows) {
      $metaKey.addClass("win");
    } else {
      $metaKey.addClass("meta");
    }
  }

  const keyMap = {
    k32: "SPACE",
    k65: "A",
    k66: "B",
    k67: "C",
    k68: "D",
    k69: "E",
    k70: "F",
    k71: "G",
    k72: "H",
    k73: "I",
    k74: "J",
    k75: "K",
    k76: "L",
    k77: "M",
    k78: "N",
    k79: "O",
    k80: "P",
    k81: "Q",
    k82: "R",
    k83: "S",
    k84: "T",
    k85: "U",
    k86: "V",
    k87: "W",
    k88: "X",
    k89: "Y",
    k90: "Z",
  };

  $("#img-preview-div").hide();

  function getResult(a) {
    return (Math.floor(a * 100) / 100).toFixed(1);
  }
  $("#scale-html_btn").click(function () {
    //   output-location container-output-location
    var e = document.getElementById("output-location");
    var btn = document.getElementById("scale-html_btn");
    var scaleV = btn.getAttribute("scaleValue");
    scaleV = scaleV - 0.1;
    if (scaleV < 0.26) {
      scaleV = 1.5;
    }
    scaleV = getResult(scaleV);
    btn.setAttribute("scaleValue", `${scaleV}`);
    btn.innerText = `缩小比例: ${scaleV}`;
    e.style.transform = `scale(${scaleV})`;
  });

  $("#save-btn").click(function () {
    var e = document.getElementById("output-location");
    // 缩小时，图片也缩小。
    var btn = document.getElementById("scale-html_btn");
    var scaleV = btn.getAttribute("scaleValue");
    var e_width = e.offsetWidth * scaleV;
    var e_height = e.offsetHeight * scaleV;
    var e_x_offset = window.scrollX + e.getBoundingClientRect().left;
    var e_y_offset = window.scrollY + e.getBoundingClientRect().top;

    // alert(`${e_width} ${e_height}  ${e_x_offset}  ${e_y_offset} `)
    html2canvas(e, {
      scale: 3,
      backgroundColor: "#eaf9e9",
      width: e_width,
      height: e_height,
      x: e_x_offset,
      y: e_y_offset,
    }).then((canvas) => {
      //document.body.appendChild(canvas)
      $("#img-preview-div").show();
      var base64image = canvas.toDataURL("image/png");
      let $imgDiv = $('<img src="' + base64image + '"/>');
      $("#img-out-preview").empty();
      $("#img-out-preview").append($imgDiv);
      // var win = window.open('', "_blank");
      // win.document.write('<img src="' + base64image + '"/>');
      // win.document.close();
    });
  });

  $("#meta-toggle").click((e) => {
    if ($(e.currentTarget).hasClass("keyboard-keydown")) {
      $(e.currentTarget).removeClass("keyboard-keydown");
      prefixKeys = "";
      prefixKeysHtml = "";
    } else {
      $(e.currentTarget).addClass("keyboard-keydown");

      if (myOs == OS.mac) {
        prefixKeys = "⌘ Cmd + ";
        prefixKeysHtml = "<kbd>⌘ Cmd</kbd>+";
      } else if (myOs == OS.windows) {
        prefixKeys = "⊞ Win + ";
        prefixKeysHtml = "<kbd>⊞ Win</kbd>+";
      } else {
        prefixKeys = "Meta + ";
        prefixKeysHtml = "<kbd>Meta</kbd>+";
      }
    }

    $("#kb-input").val(prefixKeys);
    $("#output-location").html(prefixKeysHtml);
  });

  $("body").keyup(function (e) {
    if (isTextInputMode) {
      // allow user to input any text
      var userText = $("#user-text-input").val();
      console.log("userText=" + userText);

      // remove all spaces
      userText = userText.replaceAll(" ", "");

      // split by +
      var splitKeys = userText.split("+");

      var kbString = "";
      var kbHtmlString = "";
      for (var i = 0; i < splitKeys.length; i++) {
        if (splitKeys[i].indexOf(",") != -1) {
          var commaSplits = splitKeys[i].split(",");
          for (var j = 0; j < commaSplits.length; j++) {
            kbString += commaSplits[j];
            kbHtmlString += "<kbd>" + commaSplits[j] + "</kbd>";

            if (j == commaSplits.length - 1) {
              // last one - no need to add +
            } else {
              kbString += " , ";
              kbHtmlString += ",";
            }
          }
        } else {
          kbString += splitKeys[i];
          kbHtmlString += "<kbd>" + splitKeys[i] + "</kbd>";

          if (i == splitKeys.length - 1) {
            // last one - no need to add +
          } else {
            kbString += " + ";
            kbHtmlString += "+";
          }
        }
      }

      $("#output-location").html(kbHtmlString);
      return;
    }
  });

  $("body").keydown(function (e) {
    if (isTextInputMode) {
      // // allow user to input any text
      // var userText = $('#user-text-input').val();
      // console.log("userText="+userText);

      // // remove all spaces
      // userText = userText.replaceAll(" ", "")

      // // split by +
      // var splitKeys = userText.split("+")

      // var kbString = '';
      // var kbHtmlString = '';
      // for (var i=0; i<splitKeys.length; i++) {
      //     kbString += splitKeys[i] + ' + ';
      //     kbHtmlString += '<kbd>'+splitKeys[i]+'</kbd>+';
      // }

      // $('#output-location').html(kbHtmlString);
      return;
    }
    const id = "k" + e.keyCode;
    console.log("down = " + keyMap[id] + ", keycode = " + e.keyCode);

    var kbString = prefixKeys + "";
    var kbHtmlString = prefixKeysHtml + "";

    if (e.ctrlKey) {
      kbString += "⌃ Ctrl + ";
      kbHtmlString += "<kbd>⌃Ctrl</kbd>+";
    }

    if (e.altKey) {
      if (myOs == OS.mac) {
        kbString += "⌥ Option + ";
        kbHtmlString += "<kbd>⌥Option</kbd>+";
      } else {
        kbString += "⌥ Alt + ";
        kbHtmlString += "<kbd>⌥Alt</kbd>+";
      }
    }

    if (e.shiftKey) {
      kbString += "⇧ Shift + ";
      kbHtmlString += "<kbd>⇧Shift</kbd>+";
    }

    if (e.metaKey) {
      if (myOs == OS.mac) {
        kbString += "⌘ Cmd + ";
        kbHtmlString += "<kbd>⌘Cmd</kbd>+";
      } else if (myOs == OS.windows) {
        kbString += "⊞ Win + ";
        kbHtmlString += "<kbd>⊞ Win</kbd>+";
      } else {
        kbString += "Meta + ";
        kbHtmlString += "<kbd>Meta</kbd>+";
      }
    }

    if (
      e.key != "Control" &&
      e.key != "Shift" &&
      e.key != "Alt" &&
      e.key != "Meta"
    ) {
      console.log(e.key);
      var tempKey = e.key;
      if (tempKey == "ArrowLeft") {
        tempKey = "⬅";
      } else if (tempKey == "ArrowRight") {
        tempKey = "👉🏻";
      } else if (tempKey == "ArrowUp") {
        tempKey = "⬆";
      } else if (tempKey == "ArrowDown") {
        tempKey = "⬇";
      } else if (tempKey == "Backspace") {
        if (myOs == OS.mac) {
          tempKey = "Delete";
        }
      }
      kbString += tempKey;

      if (keyMap[id] != undefined) {
        kbHtmlString += "<kbd>" + keyMap[id] + "</kbd>";
      } else {
        kbHtmlString += "<kbd>" + tempKey + "</kbd>";
      }
    }

    $("#kb-input").val(kbString);
    $("#output-location").html(kbHtmlString);

    e.preventDefault();
    e.stopPropagation();
  });
});
