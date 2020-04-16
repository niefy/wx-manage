<template>
    <div class="panel  flex flex-wrap">
        <el-tag v-for="tag in dynamicTags" closable @close="handleClose(tag)" :disable-transitions="false" :key="tag">
            {{tag}}
        </el-tag>
        <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加</el-button>
    </div>
</template>
<script>
/**
 * 标签编辑器
 */
let touchMoved = false;
export default {
    name: 'tags-editor',
    props: {
        value: {
            type: String,
            required: true,
            default: ""
        },
        size: {//标签大小：[small:小,large:大]
            type: String,
            default: 'small'
        }
    },
    data() {
        return {
            inputVisible: false,
            inputValue: ''
        }
    },
    computed: {
        dynamicTags() {
            if (this.value != "") return this.value.split(',')
            return []
        }
    },
    methods: {
        handleClose(tag) {
            let newTags = this.dynamicTags;
            newTags.splice(newTags.indexOf(tag), 1);
            this.$emit('input', newTags.join(","));
        },
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        handleInputConfirm() {
            let inputValue = this.inputValue;
            let newTags = this.dynamicTags;
            if (inputValue && newTags.indexOf(inputValue) < 0) {
                newTags.push(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
            this.$emit('input', newTags.join(","));
        }

    }
}
</script>
<style scoped>
.panel {
    flex: 1;
}
.el-tag,.button-new-tag{
    margin: 5px;
}
.input-new-tag {
    width: inherit;
}
</style>
