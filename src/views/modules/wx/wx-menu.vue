<template>
    <div>
        <div id="app-menu">
            <!-- 预览窗 -->
            <div class="weixin-preview">
                <div class="weixin-bd">
                    <div class="weixin-header">公众号菜单</div>
                    <ul class="weixin-menu" id="weixin-menu">
                        <li v-for="(btn,i) in menu.buttons" :key="i" class="menu-item" :class="{'current':selectedMenuIndex===i&&selectedMenuLevel==1}" @click="selectMenu(i)">
                            <div class="menu-item-title">
                                <span>{{ btn.name }}</span>
                            </div>
                            <ul class="weixin-sub-menu">
                                <li v-for="(sub,i2) in btn.subButtons" :key="i2" class="menu-sub-item" :class="{'current':selectedMenuIndex===i&&selectedSubMenuIndex===i2&&selectedMenuLevel==2,'on-drag-over':onDragOverMenu==(i+'_'+i2)}" @click.stop="selectSubMenu(i,i2)"  draggable="true"  @dragstart="selectSubMenu(i,i2)" @dragover.prevent="onDragOverMenu=(i+'_'+i2)" @drop="onDrop(i,i2)">
                                    <div class="menu-item-title">
                                        <span>{{sub.name}}</span>
                                    </div>
                                </li>
                                <li v-if="btn.subButtons.length<5" class="menu-sub-item" :class="{'on-drag-over':onDragOverMenu==(i+'_'+btn.subButtons.length)}" @click.stop="addMenu(2,i)" @dragover.prevent="onDragOverMenu=(i+'_'+btn.subButtons.length)" @drop="onDrop(i,btn.subButtons.length)">
                                    <div class="menu-item-title">
                                        <i class="el-icon-plus"></i>
                                    </div>
                                </li>
                                <i class="menu-arrow arrow_out"></i>
                                <i class="menu-arrow arrow_in"></i>
                            </ul>
                        </li>
                        <li class="menu-item" v-if="menu.buttons.length<3" @click="addMenu(1)"> <i class="el-icon-plus"></i></li>
                    </ul>
                </div>
            </div>
            <!-- 菜单编辑器 -->
            <div class="weixin-menu-detail" v-if="selectedMenuLevel>0">
                <wx-menu-button-editor :button="selectedButton" :selectedMenuLevel="selectedMenuLevel" @delMenu="delMenu"></wx-menu-button-editor>
            </div>
        </div>
        <div class="weixin-btn-group" v-if="isAuth('wx:menu:save')" @click="updateWxMenu">
            <el-button type="success" icon="el-icon-upload">发布</el-button>
            <el-button type="warning" icon="el-icon-delete" @click="delMenu">清空</el-button>
        </div>
    </div>
</template>
<script>
export default {
    components: {
        wxMenuButtonEditor: () => import('./wx-menu-button-editor')
    },
    data() {
        return {
            menu: { 'buttons': [] },//当前菜单
            selectedMenuIndex: '',//当前选中菜单索引
            selectedSubMenuIndex: '',//当前选中子菜单索引
            selectedMenuLevel: 0,//选中菜单级别
            selectedButton: '',//选中的菜单按钮
            onDragOverMenu:'' //当前鼠标拖动到的位置
        }
    },
    mounted() {
        this.getWxMenu();
    },
    methods: {
        getWxMenu() {
            this.$http({
                url: this.$http.adornUrl('/manage/wxMenu/getMenu')
            }).then(({ data }) => {
                if (data.code == 200) {
                    this.menu = data.data.menu;
                } else {
                    this.$message({
                        type: 'error',
                        message: data.msg
                    });
                }

            });
        },
        //选中主菜单
        selectMenu(i) {
            this.selectedMenuLevel = 1
            this.selectedSubMenuIndex = ''
            this.selectedMenuIndex = i
            this.selectedButton = this.menu.buttons[i]
        },
        //选中子菜单
        selectSubMenu(i,i2) {
            this.selectedMenuLevel = 2
            this.selectedMenuIndex = i
            this.selectedSubMenuIndex = i2
            this.selectedButton = this.menu.buttons[i].subButtons[i2]
        },
        //添加菜单
        addMenu(level,i) {
            if (level == 1 && this.menu.buttons.length < 3) {
                this.menu.buttons.push({
                    "type": "view",
                    "name": "菜单名称",
                    "subButtons": [],
                    "url": ""
                })
                this.selectMenu(this.menu.buttons.length - 1)
            }
            if (level == 2 && this.menu.buttons[i].subButtons.length < 5) {
                this.menu.buttons[i].subButtons.push({
                    "type": "view",
                    "name": "子菜单名称",
                    "url": ""
                })
                this.selectSubMenu(i,this.menu.buttons[i].subButtons.length - 1)
            }
        },
        //删除菜单
        delMenu() {
            if (this.selectedMenuLevel == 1 && confirm('删除后菜单下设置的内容将被删除')) {
                this.menu.buttons.splice(this.selectedMenuIndex, 1);
                this.unSelectMenu()
            } else if (this.selectedMenuLevel == 2) {
                this.menu.buttons[this.selectedMenuIndex].subButtons.splice(this.selectedSubMenuIndex, 1);
                this.unSelectMenu()
            }
        },
        unSelectMenu(){//不选中任何菜单
            this.selectedMenuLevel = 0
            this.selectedMenuIndex = ''
            this.selectedSubMenuIndex = ''
            this.selectedButton = ''
        },
        updateWxMenu() {
            this.$http({
                url: this.$http.adornUrl('/manage/wxMenu/updateMenu'),
                data: this.menu,
                method: 'post'
            }).then(({ data }) => {
                if (data.code == 200) {
                    this.$message.success('操作成功')
                } else {
                    this.$message.error(data.msg);
                }

            });
        },
        onDrop(i,i2){//拖拽移动位置
            this.onDragOverMenu='';
            if(i==this.selectedMenuIndex && i2==this.selectedSubMenuIndex) //拖拽到了原位置
                return 
            if(i!=this.selectedMenuIndex && this.menu.buttons[i].subButtons.length>=5){
                this.$message.error('目标组已满');
                return
            }
            this.menu.buttons[i].subButtons.splice(i2,0,this.selectedButton)
            let delSubIndex = this.selectedSubMenuIndex
            if(i==this.selectedMenuIndex && i2<this.selectedSubMenuIndex) 
                delSubIndex++
            this.menu.buttons[this.selectedMenuIndex].subButtons.splice(delSubIndex, 1);
            this.unSelectMenu()
        }
    }
}
</script>
<style src="@/assets/css/wx-menu.css"></style>