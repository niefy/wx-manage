<template>
    <div>
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="文章标题" prop="title" required>
                        <el-input v-model="dataForm.title" :maxlength="1024" placeholder="标题"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="文章类型" prop="type" required>
                        <el-select v-model="dataForm.type" placeholder="选择文章类型">
                            <el-option
                                v-for="(name,key) in ARTICLE_TYPES"
                                :key="name"
                                :label="name"
                                :value="key"
                                allow-create
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="一级目录" prop="category">
                        <el-select v-model="dataForm.category" placeholder="一级目录" allow-create>
                            <el-option
                                v-for="name in ARTICLE_CATEGORIES"
                                :key="name"
                                :label="name"
                                :value="name"
                                allow-create
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="二级分类" prop="subCategory">
                        <el-input :maxlength="50" v-model="dataForm.subCategory" placeholder="二级目录"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="dataForm.type>=2 && dataForm.type<=4">
                <el-col :span="12">
                    <el-form-item label="生效时间" prop="startTime">
                        <el-date-picker
                            v-model="dataForm.startTime"
                            type="datetime"
                            default-time="00:00:00"
                            placeholder="选择日期时间"
                            value-format="timestamp"
                        ></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="失效时间" prop="endTime">
                        <el-date-picker
                            v-model="dataForm.endTime"
                            type="datetime"
                            default-time="22:00:00"
                            placeholder="选择日期时间"
                            value-format="timestamp"
                        ></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="指向外链" prop="targetLink">
                <el-input v-model="dataForm.targetLink" placeholder="指向外链"></el-input>
            </el-form-item>
            <el-form-item label="摘要" prop="summary" v-if="dataForm.type==1 || dataForm.type==5">
                <el-input
                    v-model="dataForm.summary"
                    placeholder="摘要"
                    type="textarea"
                    rows="3"
                    maxlength="512"
                    show-word-limit
                ></el-input>
            </el-form-item>
            <el-form-item label="标签" prop="tags">
                <tags-editor v-model="dataForm.tags"></tags-editor>
            </el-form-item>
            <el-row>
                <el-form-item
                    label="图片地址"
                    prop="image"
                    :required="dataForm.type==4"
                    v-if="dataForm.type==4"
                >
                    <el-input v-model="dataForm.image" placeholder="图片链接">
                        <OssUploader slot="append" @uploaded="dataForm.image=$event"></OssUploader>
                    </el-input>
                </el-form-item>
            </el-row>
            <tinymce-editor ref="editor" v-model="dataForm.content"></tinymce-editor>
        </el-form>
        <div class="footer">
            <el-button @click="closeCurrentTab">取消</el-button>
            <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
        </div>
    </div>
</template>

<script>
let todayStart = new Date(new Date().toLocaleDateString());
export default {
    components: {
        TinymceEditor: () => import("@/components/tinymce-editor"),
        tagsEditor: () => import("@/components/tags-editor"),
        OssUploader:()=>import('../oss/oss-uploader')
    },
    data() {
        return {
            dataForm: {
                id: "",
                type: "4",
                title: "",
                content: "",
                category: "公告",
                subCategory: "",
                summary: "",
                tags: "",
                createTime: "",
                updateTime: "",
                openCount: 0,
                startTime: todayStart,
                endTime: new Date(
                    todayStart.getTime() + 24 * 60 * 60 * 1000 - 1000
                ),
                targetLink: location.origin + "/client/#/article/${articleId}",
                image: ""
            },
            dataRule: {
                type: [
                    {
                        required: true,
                        message: "文章类型不能为空",
                        trigger: "blur"
                    }
                ],
                title: [
                    { required: true, message: "标题不能为空", trigger: "blur" }
                ],
                category: [
                    { required: true, message: "分类不能为空", trigger: "blur" }
                ]
            }
        };
    },
    computed: {
        ARTICLE_TYPES: {
            get() {
                return this.$store.state.article.ARTICLE_TYPES;
            }
        },
        ARTICLE_CATEGORIES: {
            get() {
                return this.$store.state.article.ARTICLE_CATEGORIES;
            }
        }
    },
    mounted() {
        let id = this.$route.query.id;
        this.init(id);
    },
    methods: {
        init(id) {
            this.dataForm.id = id || "";
            this.$nextTick(() => {
                this.$refs["dataForm"].resetFields();
                if (id > 0) {
                    this.$http({
                        url: this.$http.adornUrl(
                            `/manage/article/info/${this.dataForm.id}`
                        ),
                        method: "get",
                        params: this.$http.adornParams()
                    }).then(({ data }) => {
                        if (data && data.code === 200) {
                            this.dataForm.type = data.article.type + "";
                            this.dataForm.title = data.article.title;
                            this.dataForm.content = data.article.content;
                            this.dataForm.category = data.article.category;
                            this.dataForm.summary = data.article.summary;
                            this.dataForm.tags = data.article.tags;
                            this.dataForm.subCategory =
                                data.article.subCategory;
                            this.dataForm.createTime = data.article.createTime;
                            this.dataForm.updateTime = data.article.updateTime;
                            this.dataForm.openCount = data.article.openCount;
                            this.dataForm.startTime = data.article.startTime;
                            this.dataForm.endTime = data.article.endTime;
                            this.dataForm.targetLink = data.article.targetLink;
                            this.dataForm.image = data.article.image;
                        }
                    });
                }
            });
        },
        // 表单提交
        dataFormSubmit() {
            this.$refs["dataForm"].validate(valid => {
                if (valid) {
                    this.$http({
                        url: this.$http.adornUrl(
                            `/manage/article/${
                                !this.dataForm.id ? "save" : "update"
                            }`
                        ),
                        method: "post",
                        data: this.$http.adornData({
                            id: this.dataForm.id || undefined,
                            type: this.dataForm.type,
                            title: this.dataForm.title,
                            content: this.dataForm.content,
                            category: this.dataForm.category,
                            summary: this.dataForm.summary,
                            tags: this.dataForm.tags,
                            subCategory: this.dataForm.subCategory,
                            createTime:
                                this.dataForm.createTime ||
                                new Date().getTime(),
                            updateTime: new Date().getTime(),
                            openCount: this.dataForm.openCount,
                            startTime: this.dataForm.startTime,
                            endTime: this.dataForm.endTime,
                            targetLink: this.dataForm.targetLink,
                            image: this.dataForm.image
                        })
                    }).then(({ data }) => {
                        if (data && data.code === 200) {
                            this.$message({
                                message: "操作成功",
                                type: "success",
                                duration: 1500,
                                onClose: () => {
                                    this.closeCurrentTab();
                                }
                            });
                        } else {
                            this.$message.error(data.msg);
                        }
                    });
                }
            });
        },
        imgUploadSuccess(response, file, fileList) {
            console.log(response);
            if (response.code == 200) {
                this.dataForm.image = response.data;
                console.log("this.article", this.article);
            } else {
                this.$message({ type: "warning", message: response.msg });
            }
        },
        closeCurrentTab() {
            this.$store.commit("common/closeCurrentTab");
        }
    }
};
</script>
<style scoped>
.footer {
    margin-top: 20px;
}
</style>
