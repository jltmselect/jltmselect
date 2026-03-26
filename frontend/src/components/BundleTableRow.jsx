import { Move } from "lucide-react";
import { useDrag, useDrop } from "react-dnd";

const BundleTableRow = ({ item, index, categoryFields, moveItem, onEdit, onRemove }) => {

    const [, ref] = useDrag({
        type: 'BUNDLE_ITEM',
        item: { index },
    });

    const [, drop] = useDrop({
        accept: 'BUNDLE_ITEM',
        hover: (draggedItem) => {
            if (draggedItem.index !== index) {
                moveItem(draggedItem.index, index);
                draggedItem.index = index;
            }
        },
    });

    return (
        <tr ref={(node) => ref(drop(node))} className="border-b hover:bg-gray-50">
            <td className="px-4 py-2 cursor-move">
                <Move size={16} className="text-gray-400" />
            </td>
            <td className="px-4 py-2">{item.quantity}</td>
            {categoryFields.sort((a, b) => a.order - b.order).map(field => (
                <td key={field.name} className="px-4 py-2">
                    {/* Safely access specifications with fallback */}
                    {item.specifications?.[field.name] || '-'}
                    {field.unit && item.specifications?.[field.name] && ` ${field.unit}`}
                </td>
            ))}
            <td className="px-4 py-2">
                <button
                    type="button"
                    onClick={(e) => onEdit(index, e)}
                    className="text-blue-600 hover:text-blue-800 mr-2"
                >
                    Edit
                </button>
                <button
                    type="button"
                    onClick={onRemove}
                    className="text-red-600 hover:text-red-800"
                >
                    Remove
                </button>
            </td>
        </tr>
    );
};

export default BundleTableRow;