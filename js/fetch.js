//Method
//this function return promise 
const getBooks = async () =>{

    //in this line we wait until we receive the response
    const response = await fetch("https://gutendex.com/books");
    const data = await response.json();
    
    return data;  
}

getBooks().then((data)=>{
    //then w
    setupPagination(data);
});

function setupPagination(data)
{

    allData = data.results;
    
    //"state" is variable where I store the data and the default page and number of rows will be shown on the page
    var state = {
        "dataList": allData,
        "rowPerPage": 5,
        "page": 1,
        "defaultPgNbr": 5
    }

    function pagination(dataList, rowPerPage, page){
        //get the first and last index to make each page with it own row of data
        var firstOfItemIndex = (page - 1) * rowPerPage;//first item should be displayed on the page
        var lastOfItemIndex = firstOfItemIndex + rowPerPage;//last item should be displayed on the page
        
        var divideData = [];//create an array to store the data, data depend on rows i have on the page
        for (let i = 0; i < dataList.length - 1; i++) {

            if(i>=firstOfItemIndex && i<lastOfItemIndex)
            {
                divideData.push(dataList[i]);
            }
        }
        
        //get number of pages 
        var pages = Math.ceil(dataList.length / rowPerPage);//get the number of pages
        
        
        return {
            "divideData": divideData,
            "pages": pages
        }
    }
    
    function loadBookList()
    {
        var data = pagination(state.dataList, state.rowPerPage, state.page);
        var bookListWrapper = document.getElementById("book-list-wrapper");

        bookListWrapper.innerHTML="";//this clear the old content on the page

        data.divideData.forEach(dataItem => {
            
            var authorsLength = Object.keys(dataItem.authors).length;
            
            //i add this if statement because some books doesn't have the author name
            if(authorsLength === 0)
            {
                //display book
                bookListWrapper.innerHTML += ` <div class="col-12 col-md-6 col-lg-3 card-col"><div class="card">
                <img class="card-img-top" src="${dataItem.formats["image/jpeg"]}" alt="Card image cap">
                <div class="card-body">
                  <h5 class="card-title">${dataItem.title}</h5>
                  <a href=${dataItem.formats["text/html"]} target="_blank" class="btn btn-primary">Read <span class="mdi mdi-book-open-blank-variant"></span></a>
                </div> 
                
              </div></div>`
            }
            else
            {
                bookListWrapper.innerHTML += ` <div class="col-12 col-md-6 col-lg-3 card-col"><div class="card">
                <img class="card-img-top" src="${dataItem.formats["image/jpeg"]}" alt="Card image cap">
                <div class="card-body">
                <h5 class="card-title">${dataItem.title}</h5>
                <p class="card-text">${dataItem.authors[0].name}</p>
                <a href=${dataItem.formats["text/html"]} target="_blank" class="btn btn-primary">Read <span class="mdi mdi-book-open-blank-variant"></span></a>
                </div> 
                
                </div></div>`
            }
            
            

        });
 
        
        addPaginationButton(data.pages);
    }
    
    function addPaginationButton(pages)
    {
        var paginationBtnList = $("#pagination-btn-list");
        paginationBtnList.html("");
        //
        var maxLeft = (state.page - Math.floor(state.defaultPgNbr / 2))//get max left pagination number
        var maxRight = (state.page + Math.floor(state.defaultPgNbr / 2))//get max right pagination number

        if (maxLeft < 1) {
            maxLeft = 1
            maxRight = state.defaultPgNbr
        }

        if (maxRight > pages) {
            maxLeft = pages - (state.defaultPgNbr - 1)
            
            if (maxLeft < 1){
                maxLeft = 1
            }
            maxRight = pages
        }
        


        for (let page = maxLeft; page <= maxRight; page++) {
            
            paginationBtnList.append(`<li class="page-item"><a class="page-link page" data-index=${page}>${page}</a></li>`);

        }

        
        if (state.page != 1) {
            //add prev when click other than page 1
            paginationBtnList.prepend(`<li class="page-item"><a class="page-link page" data-index="1" id="prevBtn">Previous</a></li>`);
        }

        if (state.page != pages) {
            //add next btn when click at any page number except the last one
            paginationBtnList.append(`<li class="page-item"><a class="page-link page" data-index=${pages} id="nextBtn">Next</a></li>`);
        }

        $(".page").on('click',function(){
            
            $("#test-container").empty();
        // state.page = Number($(this).text());
            state.page = Number($(this).attr("data-index"));
            
            loadBookList();
        });
        

    }

    loadBookList();

    }

//

