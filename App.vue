<script>
	import { logger } from '@/utils/logger'
	
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// 设置全局错误处理
			const _this = this
			uni.onError(function(err) {
				// 忽略特定的文件访问错误
				if(
					err.includes('interstitialAdExtInfo.txt') ||  // 广告文件
					err.includes('miniprogramLog') ||             // 日志文件
					err.includes('wxfile://usr') ||              // 用户目录
					err.includes('wxfile://ad')                  // 广告目录
				) {
					return
				}
				
				// 其他错误正常处理
				logger.error('App Error:', err)
				
				// 可以添加错误上报逻辑
				_this.reportError(err)
			})
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			// 错误上报方法
			reportError(error) {
				// TODO: 实现错误上报逻辑
				if(process.env.NODE_ENV === 'development') {
					logger.warn('Error reported:', error)
				}
			}
		}
	}
</script>

<style>
	/*每个页面公共css */
	page {
		background-color: #f5f5f5;
	}
</style>
