<template>

  <div id="app">

   <!-- <el-input
      placeholder="请输入内容"
      prefix-icon="el-icon-search"
      v-model="input2">
    </el-input>
    <el-button type="primary" icon="el-icon-search">搜索</el-button>-->
    <el-input placeholder="请输入角色名" v-model="rolename" class="input-with-select" style="width: 400px">
      <el-button slot="append" icon="el-icon-search" @click="queryrole"></el-button>
    </el-input>
    <el-button type="primary" @click="dialogVisible = true">添加角色</el-button>

    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="roleid"
        label="ID"
        width="180">
      </el-table-column>

      <el-table-column
        prop="rolename"
        label="角色名"
        width="180">
      </el-table-column>

      <el-table-column
        prop=""
        label="操作">

        <template slot-scope="scope">

          <el-button type="primary" icon="el-icon-edit" circle @click="openupdrole(scope.row.roleid,scope.row.rolename)"></el-button>

          <el-popconfirm @confirm="delpinlun(scope.row.roleid)"
            title="确定删除吗？">

            <el-button type="danger" icon="el-icon-delete" slot="reference" circle></el-button>

          </el-popconfirm>

        </template>

      </el-table-column>
    </el-table>

    <div>
      共计{{totalpage}}页     当前第{{pageindex}}页
      <nav >
        <ul class="pager">
          <li><a href="#" @click.prevent="prvpage">上一页</a></li>
          <li><a href="#" @click.prevent="nextpage">下一页</a></li>
        </ul>
      </nav>
    </div>


    <!--添加弹出框-->
    <el-dialog
      title="角色添加"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-input placeholder="请输入角色名" v-model="add_rolename" class="input-with-select" style="width: 400px">
      </el-input>
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="addrole">提 交</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
  </span>
    </el-dialog>
    <!--修改弹出框-->
    <el-dialog
      title="角色修改"
      :visible.sync="updrolelog"
      width="30%"
      :before-close="updroleClose">
      <input v-model="upd_roleid" type="hidden"></input>
      <el-input placeholder="请输入角色名" v-model="upd_rolename" class="input-with-select" style="width: 400px"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updrole">提 交</el-button>
    <el-button @click="updrolelog = false">取 消</el-button>

  </span>

    </el-dialog>
  </div>


</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      dialogVisible: false,
      updrolelog:false,
      tableData: [],
      pagevo:{},   //pagevo数据
      pageindex:1,   //当前显示的页码
      totalpage:0,  //总页数
      rolename:"",
      add_rolename:"",
      upd_rolename:"",
      upd_roleid:0,
      count:0
    }


  },
  methods:{
    //打开添加弹出框
    handleClose(done) {
          done();

  },
    //打开修改弹出框
    updroleClose(done) {
          done();
    },
    getdata(){  //获取数据
       var _this =this;

      var params = new URLSearchParams();
      params.append("rolename",_this.rolename);
      params.append("page",_this.pageindex);
      params.append("rows",5);

        this.$axios.post("queryRole2.action",params).
        then(function (result) {  //成功  执行then里面的方法
          _this.tableData=result.data.rows;

          //计算总页数
          var totalrecord =result.data.total;
          console.log(totalrecord);

          _this.totalpage = totalrecord%5==0?totalrecord/5:Math.floor(totalrecord/5)+1;


        }).catch(function () { //失败 执行catch方法

        });
    },
    delpinlun(roleid){

      var _this =this;
      var params = new URLSearchParams();
      params.append("id", roleid);


      this.$axios.post("deleteRole.action",params)
        .then(function (result) {  //成功  执行then里面的方法

        _this.$message({
          message: result.data,
          type: 'success'
        });

        _this.getdata();  //删除操作做完，刷新数据

      }).catch(function (error) { //失败 执行catch方法
        alert(error)
      });


    },
    prvpage:function () {  //上一页
      this.pageindex =  this.pageindex==1?1:this.pageindex-1;
      this.getdata();  //调用获取数据的方法
    },
    nextpage:function () { //下一页

      this.pageindex =  this.pageindex==this.totalpage?this.totalpage:this.pageindex+1;
      this.getdata();  //调用获取数据的方法
    },
    queryrole :function () { //查询功能

      this.getdata();  //调用获取数据的方法
    },
    addrole :function () {
      var thisPL = this;
      var params = new URLSearchParams();
      params.append("rolename",thisPL.add_rolename);
      this.$axios.post("addRole.action",params)
        .then(function (result) {   //异步调用成功
          let rs=result.data;
          if(rs=="添加成功"){
            thisPL.dialogVisible = false;
            alert(rs);
            thisPL.getdata();  //调用获取数据的方法

          }
        })
        .catch(function (error) {
          alert(error);  //异步调用失败时，执行
        });
    },
    openupdrole:function(roleid,rolename){
      //修改数据回显
      this.updrolelog=true;
      this.upd_rolename=rolename;
      this.upd_roleid=roleid;

    },
    updrole :function () {
      var thisPL = this;
      var params = new URLSearchParams();
      params.append("rolename",thisPL.upd_rolename);
      params.append("roleid",thisPL.upd_roleid);
      this.$axios.post("updateRole.action",params)
        .then(function (result) {   //异步调用成功
          let rs=result.data;
          if(rs=="修改成功"){
            thisPL.updrolelog = false;
            alert(rs);
            thisPL.getdata();  //调用获取数据的方法

          }
        })
        .catch(function (error) {
          alert(error);  //异步调用失败时，执行
        });
    }
  },
  created() {
    this.getdata();
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
