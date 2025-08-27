export interface Props {
    // 每个成员的大小，默认为 `medium`
    size?: 'small' | 'medium'

    // 显示的成员列表
    members?: TeamMember[]
}
interface SocialLink {
    icon: string | { svg: string }
    link: string
    ariaLabel?: string
}
interface TeamMember {
    // 成员的头像图像
    avatar: string

    // 成员的名称
    name: string

    // 成员姓名下方的标题
    // 例如：Developer, Software Engineer, etc.
    title?: string

    // 成员所属的组织
    org?: string

    // 组织的 URL
    orgLink?: string

    // 成员的描述
    desc?: string

    // 社交媒体链接，例如 GitHub、Twitter 等，可以在此处传入 Social Links 对象
    // 参见: https://vitepress.dev/reference/default-theme-config.html#sociallinks
    links?: SocialLink[]

    // 成员 sponsor 页面的 URL
    sponsor?: string

    // sponsor 链接的文本，默认为 'Sponsor'
    actionText?: string
}