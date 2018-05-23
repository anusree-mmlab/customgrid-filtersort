import { Component } from '@angular/core';
import * as _ from 'lodash';
//import {SuperTable, ISuperTableColumn} from 'ngx-super-table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  initialMarkList: any = [];
  markList: any = [];
  markListCopy:any = [];
  markListPager: any = [];
  isPageReady = false;
  pager: any;
  queryLimit: number = 100;
  itemPerPageCount: number = 5;
  offSet: number = 0;
  pageCount: any = [];
  sortFields: any = {};
  filterOptions: any = {};


  title = 'app';

  constructor() {
    this.initialisePager();
    this.initialiseSortFields();
    this.initialiseFilterOptions();

    setTimeout(() => {
      this.setMarksArray();
    }, 100);
  }

  initialiseFilterOptions() {
    this.filterOptions = { name: '', division: '', marks: '', grade: '', city: '' };
  }

  initialiseSortFields() {
    this.sortFields = { name: '', division: '', marks: '', grade: '', city: '' };
  }

  modifySortFields(key, value) {
    this.sortFields = { ...this.sortFields, [key]: value };

    console.log(this.sortFields)
  }

  initialisePager() {
    this.pager = {
      limit: this.itemPerPageCount,
      offset: 0,
      total_count: 0,
      current_page: 1
    };

    this.setPagerArray();
    this.markList = [];
    this.markListCopy = this.markList;
    this.markListPager = [];
  }

  setPagerArray() {
    this.pageCount = [];
    const pCount = Math.ceil(this.pager.total_count / this.itemPerPageCount);
    for (let i = 0; i < pCount; i++) {
      this.pageCount.push(i + 1);
    }
  }

  setMarksArray() {
    this.initialMarkList = [
      { name: 'Alan', division: 'B', marks: 100, grade: 'A', city: 'Kottayam' },
      { name: 'Nina', division: 'B', marks: 50, grade: 'C', city: 'Pala' },
      { name: 'Nila', division: 'A', marks: 80, grade: 'B', city: 'Cochin' },
      { name: 'Anita', division: 'A', marks: 90, grade: 'A', city: 'Pala' },
    ];
    this.markList = this.initialMarkList;
    this.markListCopy = this.markList;
    this.pager['total_count'] = this.markList.length;
    this.setPagerArray();
    this.onPageChange(1);
  }

  onPageChange(page) {
    if (this.isPageReady === false) {
      this.isPageReady = true;
    }

    if ((page <= 0)
      // || (page > this.pageCount.length)
    ) {
      console.log('RETURN');
      return true;
    }

    this.pager['current_page'] = page;
    this.pager['offset'] = this.itemPerPageCount * (page - 1);

    //const markListArr = [...this.markList];
    const markListArr = [...this.markListCopy];
    const splitStart = (this.pager.current_page - 1) * (this.itemPerPageCount);

    this.markListPager = markListArr.splice(splitStart, this.itemPerPageCount);
  }

  sortData(field, currentOrder) {
    console.log(this.markList);
    const order = currentOrder === 'asc' ? 'desc' : 'asc';
    //this.markList = _.orderBy(this.markList, [field], [order]);
    this.markListCopy = _.orderBy(this.markListCopy, [field], [order]);
    this.onPageChange(1);

    this.modifySortFields(field, order);
  }

  sortClass(order) {
    if (order === '') {
      return 'sorting';
    } else {
      return order === 'asc' ? 'sorting_asc' : 'sorting_desc';
    }
  }

  modifyFilterOptions(key, value) {
    this.filterOptions = { ...this.filterOptions, [key]: value };

    console.log(this.filterOptions)
  }

  reInitialise() {
    const keyArr = Object.keys(this.filterOptions);

    const countArr = keyArr.map((key,i) => {
      if(this.filterOptions[key] === "" ) {
        return i+1;
      } else {
        return 0;
      }
    });

    const newCoutArr = countArr.filter((o) => {
        if(o !== 0) {
          return o;
        }
    });

    if(newCoutArr.length === keyArr.length) {
      this.setMarksArray();
      return true;
    }
  }

  filterDataBySelect(event, field, type) {
    setTimeout(() => {
      const value = event.target.value;

      if (value === "") { 
        this.modifyFilterOptions(field, '');

        // Re - initialise
        this.reInitialise();
      } else {
        this.modifyFilterOptions(field, value);
      }

      const markListArr = [...this.markList];

      const keyArr = Object.keys(this.filterOptions);

      //===========================SELECT
      const filterOptionsVal = keyArr.map((key) => {
        if(this.filterOptions[key] != '' && !['name', 'city'].includes(key) ) {
          return { [key]: this.filterOptions[key]}
          //return 1;
        } else {
          return null;
        }
      });
      
      const fArr = filterOptionsVal.filter((op) => {
        if(op !== null) {
          return op
        }
      })
     const selectFilterOptions =  Object.assign({}, ...fArr);
     console.log('filterOptionsVal',selectFilterOptions);

     let filteredRes = markListArr;
     if (_.isEmpty(selectFilterOptions)) {
        console.error('filter option is empty');
        //return true;
     } else {
      filteredRes = _.filter(markListArr, selectFilterOptions);
     }
     


     //============================INPUT
     const filterIOptionsVal = keyArr.map((key) => {
      if(this.filterOptions[key] != '' && !['division', 'grade'].includes(key) ) { 
        return { [key]: this.filterOptions[key]}
        //return 1;
      } else {
        return null;
      }
    });
    
    const fIArr = filterIOptionsVal.filter((op) => {
      if(op !== null) {
        return op
      }
    })
   const inputFilterOptions =  Object.assign({}, ...fIArr);
   console.log('inputFilterOptions',inputFilterOptions);

   if (_.isEmpty(inputFilterOptions)) {
      console.error('input filter option is empty');
      //return true;
   } else {
    const newFilteredRes = filteredRes.map((o) => {
      if (!_.isNil(o)) {

       const resultArr = Object.keys(inputFilterOptions).map((ikey)=>{
          const rs = o[ikey].match(inputFilterOptions[ikey]);
          if (!_.isNull(rs)) {
            return o;
          } 
        })

        if(resultArr.length >0) {
          console.log('resultArr', JSON.stringify(resultArr[0]));
          return resultArr[0];
        }
      }
    });


    //console.log('new res', JSON.stringify(newFilteredRes));

    filteredRes = newFilteredRes.filter((op) => { 
      if(!_.isNil(op)
      ) {
        return op
      }
    })

    console.log('new res', JSON.stringify(filteredRes));
   }


      let page = 1;
      if (_.isNil(filteredRes)) {
        page = 0;
        this.pager['total_count'] = 0;
      } else {
        this.pager['total_count'] = filteredRes.length;
      }
      this.setPagerArray();

      if (this.isPageReady === false) {
        this.isPageReady = true;
      }

      if ((page <= 0)
        // || (page > this.pageCount.length)
      ) {
        this.markListPager = [];
        console.log('RETURN');
        return true;
      }

      this.pager['current_page'] = page;
      this.pager['offset'] = this.itemPerPageCount * (page - 1);
      const splitStart = (this.pager.current_page - 1) * (this.itemPerPageCount);

      //Setting the marklist as the filtered res, so that the sorting applies on this data
      //this.markList = JSON.parse(JSON.stringify(filteredRes));
      //console.dir( this.markList);
      this.markListCopy = JSON.parse(JSON.stringify(filteredRes));

      this.markListPager = filteredRes.splice(splitStart, this.itemPerPageCount);
    }, 50);
  }

  filterDataByInput(event, field) {
    setTimeout(() => {
      const value = event.target.value;

      if(value === "") {
        // Re - initialise
        this.setMarksArray();
      }
      const markListArr = [...this.markList];

      const filteredRes = _.filter(markListArr, (o) => {
        if (!_.isNil(o)) {
          const res = o[field].match(value);
          if (!_.isNull(res)) {
            return o;
          } 
        }
      });

      setTimeout(() => {
        console.log(value, '--', filteredRes);
      }, 10);



      let page = 1;
      if (_.isNil(filteredRes)) {
        page = 0;
        this.pager['total_count'] = 0;
      } else {
        this.pager['total_count'] = filteredRes.length;
      }
      this.setPagerArray();

      if (this.isPageReady === false) {
        this.isPageReady = true;
      }

      if ((page <= 0)
        // || (page > this.pageCount.length)
      ) {
        this.markListPager = [];
        console.log('RETURN');
        return true;
      }

      this.pager['current_page'] = page;
      this.pager['offset'] = this.itemPerPageCount * (page - 1);
      const splitStart = (this.pager.current_page - 1) * (this.itemPerPageCount);

      //Setting the marklist as the filtered res, so that the sorting applies on this data
      //this.markList = JSON.parse(JSON.stringify(filteredRes));

      this.markListPager = filteredRes.splice(splitStart, this.itemPerPageCount);
    }, 50);
  }
}
