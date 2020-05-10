<template>
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane :label="'图片素材（'+assetsCount.imageCount+')'" name="image">
            <material-file fileType="image" ref="imagePanel" @change="materialCount"></material-file>
        </el-tab-pane>
        <el-tab-pane :label="'语音素材（'+assetsCount.voiceCount+')'" name="voice">
            <material-file fileType="voice" ref="voicePanel" @change="materialCount"></material-file>
        </el-tab-pane>
        <el-tab-pane :label="'视频素材（'+assetsCount.videoCount+')'" name="video">
            <material-file fileType="video" ref="videoPanel" @change="materialCount"></material-file>
        </el-tab-pane>
        <el-tab-pane :label="'图文素材（'+assetsCount.newsCount+')'" name="news">
            <material-news ref="newsPanel" @change="materialCount"></material-news>
        </el-tab-pane>
    </el-tabs>
</template>
<script>
import MaterialFile from './material-file'
import MaterialNews from './material-news'
export default {
    data() {
        return {
            activeTab: 'news',
            assetsCount:{
                imageCount:'..',
                videoCount:'..',
                voiceCount:'..',
                newsCount:'..'
            }
        };
    },
    components: {
        MaterialFile,MaterialNews
    },
    mounted(){
        this.$refs[this.activeTab+'Panel'].init()
        this.materialCount();
    },
    methods: {
        handleTabClick(tab, event) {
            console.log(tab.name);
            this.$refs[tab.name+'Panel'].init()
        },
        materialCount(){
            this.$http({
                url: this.$http.adornUrl('/manage/wxAssets/materialCount')
            }).then(({ data }) => {
                if (data && data.code == 200) {
                    this.assetsCount=data.data
                } else {
                    this.$message.error(data.msg);
                }
            })
        }

    }
};
</script>