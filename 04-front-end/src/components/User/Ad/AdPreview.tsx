import IAd from '../../../models/IAd.model';

export interface IAdPreviewProperties {
    ad: IAd;
}

export default function AdPreview(props: IAdPreviewProperties) {
    return (
        <div>
            <h2>{ props.ad.title }</h2>
            <p>{ props.ad.description}</p>
            <p>{ props.ad.country}</p>
            <p>{ props.ad.color}</p>
            <p>{ props.ad.flowerKind}</p>
            <p>{ props.ad.price}</p>
        </div>
    );
}