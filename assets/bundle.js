/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/////////Libraries//////////////
const css = __webpack_require__(0);
const $ = __webpack_require__(1);

/////////Constants//////////////
const client = Asana.Client.create().useBasicAuth('0/b63cf889908b6e2a30db17a7bc8ab35d');
const animEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
const cache = {};

///////Data containers for holding API data//////
let cd = {
  username: '',
  userid: '',
  workspaces: '',
  projects: {}
};
let pObj = {};

/////////Taskr Object/////////////
const Taskr = {
  //get projects method//
  getProjects() {
    $.each(cd.projects, (i, el)=> {//iterate through the object of returned projects
      $('#ps-drop').append('<span class="hide">'+el.id+'</span><p class="p-name">'+el.name+'</p>');
      pObj[el.name] = el.id;//hold onto ids for later
    })
    $('#ps-menu').show();//show dropdown
    $('.p-name').on('click', function() {
      let pId = $(this).prev('span').text();//grab id for method call
      let pName = $(this).text();
      let pNameId = pName.replace(/\s+/g, '-').replace(/[^a-zA-Z-]/g, '').toLowerCase();//strip punctuation and whitespace for id of column header
      $('#projectlist').append('<li id="'+pNameId+'" class="animated slideInLeft"><b>'+pName+'</b></p>').one(animEnd, function() {//append to sidebar
        $(this).removeClass('animated slideInLeft');
      });
      Taskr.getTasks(pId, pName);//call get tasks method
    });
  },
  //get tasks method//
  getTasks(projectId, projectName) {
    client.tasks.findByProject(projectId, {
      opt_fields: 'id, name, notes',
      limit: 20,
    })
    .then((response)=> {
      return response.data;
    })
    .then((tasks)=>{//add to project's column
      $('#task-results').append('<div class="project-column flex-column"><div class="column-name"><h2 class="middle p-name">'+projectName+'</h2><i class="fa fa-times column-close" aria-hidden="true"></i></div><section class="cards"></section></div>');
      $.each(tasks, (i, el)=>{//apend task cards
        $('.cards').append('<div class="column-item task-box one"><span class="remove"><i class="fa fa-times" aria-hidden="true"></i></span><div class="task-title buffer"><h3>'+el.name+'</h3></div><div class="task-desc buffer"><p>'+el.notes+'</p></div></div>');
      })
    })

  },
  //method to remove tasks
  clearTasks(self) {
    console.log('click');
    self.closest('div.column-item').addClass('animated bounceOutLeft').one(animEnd, function() {
      $(this).removeClass('animated bounceOutLeft');
    }).hide(1000, function(){
      $(this).remove();
    });
  },
  //method to remove projects
  clearProjects(self) {
    let listItem = self.closest(".project-column").find(".p-name").text().toString();
    let itemId = listItem.replace(/\s+/g, '-').replace(/[^a-zA-Z-]/g, '').toLowerCase();
    console.log(listItem);
    self.closest('div.project-column').addClass('animated bounceOutLeft').hide('slow', function() {
      $(this).remove();
    });
    $('#'+ itemId).addClass('animated bounceOutLeft').hide('slow', function() {
      $(this).remove();
    });
  },
  init() {
    //initialize application
    client.users.me()
    //get user
      .then((response)=> {
        let wsId = response.workspaces[0].id;
        let wsName = response.workspaces[0].name;
        let name = response.name;
        cd.workspaces = response.workspaces;
        cd.userid = response.id;
        cd.username = response.name;
        $('#username').append(name);
        $('#workspace-name').append('<h3>'+wsName+'</h3>');//work with main workspace
        //return projects
        return client.projects.findAll({
          assignee: cd.userid,
          workspace: wsId,
          opt_fields: 'id, name, notes',
          limit: 20,
        });
     })//promise
     .then((foundProj)=> {
       return foundProj.data;
     })
     .then((proj)=> {
       $.each(proj, (i, el)=> {//append projects to data container
         cd.projects[i] = el;
       })
     }).then(()=> {
         Taskr.getProjects();//call getProjects mthod
     });
   }
};

/////////////////DOM Ready///////////////////

$(document).ready(()=> {
  Taskr.init();//initial;ize
  $('#ps-menu').hide();//make sure drop down is hidden until populated with projects
  //handler for task removal
  $(document).on('mousedown', '.remove', function() {
    let self = $(this);//make sure we're referring to the right selector since it's dynamically created
    Taskr.clearTasks(self);//call clearTasks method
  });
  //handler for project column removal
  $(document).on('mousedown', '.column-close', function() {
    let self = $(this);//make sure we're referring to the right selector since it's dynamically created
    Taskr.clearProjects(self);//call clearProjects mthod
  });
  //handler for dropdown (done in vanilla JS because it was giving me trouble)
  $('#show-drop').mousedown(()=> {
    document.getElementById("ps-drop").classList.toggle("show");
  });
  window.onclick = (e)=> {
    if (!e.target.matches('.dropbtn')) {
      let dropdowns = document.getElementsByClassName("dropdown-content");
      let i;
      for (i = 0; i < dropdowns.length; i++) {
        let openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }

});


/***/ })
/******/ ]);