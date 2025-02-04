<template>
	<view class="container">
		<!-- Logo和欢迎语 -->
		<view class="welcome">
			<image class="logo" src="/static/logo.png" mode="aspectFit"></image>
			<text class="title">欢迎使用平德管理系统</text>
		</view>

		<!-- 身份选择区域 -->
		<view class="role-section">
			<text class="section-title">请选择您的身份</text>
			<view class="role-grid">
				<!-- 供应商入口 -->
				<view 
					class="role-item"
					@tap="navigateTo('/pages/supplier/index')"
				>
					<image class="role-icon" src="/static/supplier.png" mode="aspectFit"></image>
					<text class="role-name">供应商门户</text>
				</view>

				<!-- 生产部门入口 -->
				<view 
					class="role-item"
					@tap="navigateTo('/pages/production/index')"
				>
					<image class="role-icon" src="/static/production.png" mode="aspectFit"></image>
					<text class="role-name">生产部门</text>
				</view>

				<!-- 品控部门入口 -->
				<view 
					class="role-item"
					@tap="navigateTo('/pages/quality/index')"
				>
					<image class="role-icon" src="/static/quality.png" mode="aspectFit"></image>
					<text class="role-name">品控部门</text>
				</view>

				<!-- 管理后台入口 -->
				<view 
					class="role-item"
					@tap="navigateTo('/pages/admin/index')"
				>
					<image class="role-icon" src="/static/admin.png" mode="aspectFit"></image>
					<text class="role-name">管理后台</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '平德管理系统'
			}
		},
		onLoad() {

		},
		methods: {
			navigateTo(url) {
				uni.navigateTo({
					url: url
				})
			}
		}
	}
</script>

<style>
	.container {
		padding: 40rpx;
		min-height: 100vh;
		background: #f5f5f5;
	}

	/* 欢迎区域 */
	.welcome {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 60rpx;
	}

	.logo {
		width: 200rpx;
		height: 200rpx;
		margin-bottom: 20rpx;
	}

	.title {
		font-size: 36rpx;
		color: #333;
		font-weight: bold;
	}

	/* 身份选择区域 */
	.role-section {
		background: #fff;
		border-radius: 12rpx;
		padding: 30rpx;
	}

	.section-title {
		font-size: 32rpx;
		color: #333;
		margin-bottom: 30rpx;
		display: block;
	}

	.role-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 30rpx;
	}

	.role-item {
		background: #f8f8f8;
		border-radius: 12rpx;
		padding: 40rpx 20rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		transition: all 0.3s;
	}

	.role-item:active {
		background: #f0f0f0;
	}

	.role-icon {
		width: 100rpx;
		height: 100rpx;
		margin-bottom: 20rpx;
	}

	.role-name {
		font-size: 28rpx;
		color: #333;
	}
</style>
