<template>
    <div>
        <div class="menu-input-group" style="border-bottom: 2px #e8e8e8 solid;">
            <div class="menu-name">{{button.name}}</div>
            <div class="menu-del" @click="$emit('delMenu')">删除菜单</div>
        </div>
        <div class="menu-input-group">
            <div class="menu-label">菜单名称</div>
            <div class="menu-input">
                <input type="text" name="name" placeholder="请输入菜单名称" class="menu-input-text" v-model="button.name" @input="checkMenuName(button.name)">
                <p class="menu-tips" style="color:#e15f63" v-show="menuNameBounds">字数超过上限</p>
                <p class="menu-tips">字数不超过{{selectedMenuLevel==1?'5':'8'}}个汉字</p>
            </div>
        </div>
        <div v-show="!button.subButtons || button.subButtons.length==0">
            <div class="menu-input-group">
                <div class="menu-label">菜单内容</div>
                <div class="menu-input">
                    <select v-model="button.type" name="type" class="menu-input-text">
                        <option value="view">跳转网页(view)</option>
                        <option value="media_id">发送消息(media_id)</option>
                        <!--<option value="view_limited">跳转公众号图文消息链接(view_limited)</option>-->
                        <option value="miniprogram">打开指定小程序(miniprogram)</option>
                        <option value="click">自定义点击事件(click)</option>
                        <option value="scancode_push">扫码上传消息(scancode_push)</option>
                        <option value="scancode_waitmsg">扫码提示下发(scancode_waitmsg)</option>
                        <option value="pic_sysphoto">系统相机拍照(pic_sysphoto)</option>
                        <option value="pic_photo_or_album">弹出拍照或者相册(pic_photo_or_album)</option>
                        <option value="pic_weixin">弹出微信相册(pic_weixin)</option>
                        <option value="location_select">弹出地理位置选择器(location_select)</option>
                    </select>
                </div>
            </div>
            <div class="menu-content" v-if="button.type=='view'">
                <div class="menu-input-group">
                    <p class="menu-tips">订阅者点击该子菜单会跳到以下链接</p>
                    <div class="menu-label">页面地址</div>
                    <div class="menu-input">
                        <input type="text" placeholder="" class="menu-input-text" v-model="button.url">
                    </div>
                </div>
            </div>
            <div class="menu-content" v-else-if="button.type=='media_id'">
                <div class="menu-input-group">
                    <p class="menu-tips">订阅者点击该菜单会收到以下图文消息</p>
                    <div class="menu-label">media_id</div>
                    <div class="menu-input">
                        <input type="text" placeholder="图文消息media_id" class="menu-input-text" v-model="button.mediaId">
                    </div>
                </div>
            </div>
            <div class="menu-content" v-else-if="button.type=='miniprogram'">
                <div class="menu-input-group">
                    <p class="menu-tips">订阅者点击该子菜单会跳到以下小程序</p>
                    <div class="menu-label">小程序appId</div>
                    <div class="menu-input">
                        <input type="text" placeholder="小程序的appId（仅认证公众号可配置）" class="menu-input-text" v-model="button.appId">
                    </div>
                </div>
                <div class="menu-input-group">
                    <div class="menu-label">小程序路径</div>
                    <div class="menu-input">
                        <input type="text" placeholder="小程序的页面路径 pages/index/index" class="menu-input-text" v-model="button.pagePath">
                    </div>
                </div>
                <div class="menu-input-group">
                    <div class="menu-label">备用网页</div>
                    <div class="menu-input">
                        <input type="text" placeholder="" class="menu-input-text" v-model="button.url">
                        <p class="menu-tips">旧版微信客户端无法支持小程序，用户点击菜单时将会打开备用网页。</p>
                    </div>
                </div>
            </div>
            <div class="menu-content" v-else>
                <div class="menu-input-group">
                    <p class="menu-tips">用于消息接口推送，不超过128字节</p>
                    <div class="menu-label">菜单KEY值</div>
                    <div class="menu-input">
                        <input type="text" placeholder="" class="menu-input-text" v-model="button.key">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        selectedMenuLevel: {
            type: Number,
            default: 1
        },
        button: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            menuNameBounds: false,//菜单长度是否过长
        }
    },
    methods: {
        //检查菜单名称长度
        checkMenuName: function (val) {
            if (this.selectedMenuLevel == 1 && this.getMenuNameLen(val) <= 10) {
                this.menuNameBounds = false
            } else if (this.selectedMenuLevel == 2 && this.getMenuNameLen(val) <= 16) {
                this.menuNameBounds = false
            } else {
                this.menuNameBounds = true
            }
        },
        //获取菜单名称长度
        getMenuNameLen: function (val) {
            var len = 0;
            for (var i = 0; i < val.length; i++) {
                var a = val.charAt(i);
                a.match(/[^\x00-\xff]/ig) != null ? len += 2 : len += 1;
            }
            return len;
        }
    }
}
</script>