<template>
    <el-dialog title="选择素材"  :visible.sync="visible" :modal="true" append-to-body>
        <material-news v-if="selectType=='news'" @selected="onSelect" selectMode></material-news>
        <material-file v-else :fileType="selectType" @selected="onSelect" selectMode></material-file>
    </el-dialog>
</template>
<script>
export default {
    name:"assets-selector",
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
        }
    }
}
</script>