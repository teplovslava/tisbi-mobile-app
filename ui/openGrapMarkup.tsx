import { ActivityIndicator, Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { memo, useEffect, useState } from 'react'
import { getLinkPreview } from 'link-preview-js';
import SText, { Sizes } from '@/components/StyledText';
import Colors from '@/constants/Colors';

const OpenGraphMarkup = ({ url }: { url: string }) => {
    const [previewData, setPreviewData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getLinkPreview(url)
            .then(data => {
                setPreviewData(data);
                setLoading(false);
            })
            .catch(error => {
                setLoading(false);
            });
    }, [url]);

    if (loading) {
        return null;
    }

    if (!previewData) {
        return null
    }
    return (
        <TouchableOpacity activeOpacity={0.9} onPress={() => Linking.openURL(url)} style={{ flexDirection: 'row', gap: 10, padding: 10, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.45)', width: '100%', }}>
            {previewData.images?.length > 0 && (
                <Image source={{ uri: previewData.images[0] }} style={styles.image} />
            )}
            <View style={styles.textContainer}>
                <SText size={Sizes.bold} textStyle={styles.title}>{previewData.title}</SText>
                <SText textStyle={styles.description}>{previewData.description}</SText>
            </View>
        </TouchableOpacity>
    )
}

export default memo(OpenGraphMarkup)

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 10,
        borderRadius: 10,
    },
    image: {
        width: 30,
        height: 30,
    },
    textContainer: {
        flexGrow: 1, flexShrink: 1
    },
    title: {
        color: Colors.light,
        fontSize: 10,
        marginBottom: 3
    },
    description: {
        color: Colors.light,
        fontSize: 10
    },
});