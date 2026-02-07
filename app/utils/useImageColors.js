import { useState, useEffect } from 'react'
import { getColors } from 'react-native-image-colors'

const useImageColors = (uri) => {
	const [colors, setColors] = useState(null)

	useEffect(() => {
		if (!uri) {
			setColors(null)
			return
		}

		let cancelled = false

		getColors(uri, {
			fallback: '#000000',
			cache: true,
			key: uri,
			quality: 'low',
		}).then((result) => {
			if (cancelled) return

			if (result.platform === 'android') {
				setColors({
					primary: result.darkVibrant || result.dominant,
					secondary: result.muted || result.darkMuted || result.dominant,
				})
			} else if (result.platform === 'ios') {
				setColors({
					primary: result.background,
					secondary: result.primary,
				})
			} else if (result.platform === 'web') {
				setColors({
					primary: result.darkVibrant || result.dominant,
					secondary: result.muted || result.darkMuted || result.dominant,
				})
			} else {
				// Fallback for unexpected platforms to avoid keeping stale colors
				setColors(null)
			}
		}).catch(() => {
			if (!cancelled) setColors(null)
		})

		return () => { cancelled = true }
	}, [uri])

	return colors
}

export default useImageColors
