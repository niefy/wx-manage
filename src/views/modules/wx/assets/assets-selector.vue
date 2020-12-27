<template>
    <el-dialog title="选择素材"  :visible.sync="dataVisible" :modal="true" append-to-body  @close="onClose">
        <material-news v-if="selectType=='news'" @selected="onSelect" selectMode></material-news>
        <material-file v-else :fileType="selectType" @selected="onSelect" selectMode></material-file>
    </el-dialog>
</template>
<script>
export default {
    name:"assets-selector",
    data:function (){
        return {
            dataVisible : this.visible
        }
    },
    components:{
        MaterialFile:()=>import('./material-file'),
        MaterialNews:()=>import('./material-news')
    },
    props:{
        selectType:{// image、voice、video、news
            type:String,
            default:'image'
        },
        visible:{
            type:Boolean,
            default:false
        }
    },
    methods:{
        onSelect(itemInfo){
            this.$emit('selected', itemInfo)
        },
        onClose(){
            this.$emit('onClose')
        }
    }
}
</script>